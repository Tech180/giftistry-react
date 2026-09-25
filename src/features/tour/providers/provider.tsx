import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi, useAuth, type TourChapterId } from 'features/auth';
import { DemoListProvider } from '../demo/provider';
import { useTourDemo } from '../demo/context';
import type { TourEligibilityContext } from '../constants/chapters.constant';
import { stepsForChapter } from '../constants/steps.constant';
import { TourContext } from './context';
import type { TourContextType } from './interfaces/context-type.interface';
import {
  clearTourResume,
  readTourResume,
  writeTourResume,
} from '../utils/resume-storage.util';
import {
  chapterStatus,
  firstPendingChapterId,
  nextAdvancedChapterId,
  normalizeClientTour,
  shouldAutoStartTour,
} from '../utils/tour-progress.util';
import { isDemoListPath } from '../utils/is-demo-list-id.util';
import { TOUR_DEMO_LIST_ID } from '../constants/targets.constant';
import { isTourMobileViewport, resolveStepVariant } from '../utils/resolve-variant.util';
import { stepNeedsDemoList } from '../utils/step-needs-demo-list.util';
import { isAuthPath } from './utils/is-auth-path.util';
import { runBeforeShow } from './utils/run-before-show.util';

function chapterSteps(chapterId: TourChapterId) {
  return stepsForChapter(chapterId);
}

function TourProviderInner({ children }: { children: ReactNode }) {
  const { user, refreshUser, canShowAi, isAuthenticated } = useAuth();
  const demo = useTourDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeChapterId, setActiveChapterId] = useState<TourChapterId | null>(null);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [createdListId, setCreatedListId] = useState<string | null>(null);

  const autoStartedRef = useRef(false);
  const advancingRef = useRef(false);
  const blockDemoRouteRef = useRef(false);
  const nextRef = useRef<() => Promise<void>>(async () => undefined);
  const deactivateRef = useRef(demo.deactivate);
  deactivateRef.current = demo.deactivate;

  const eligibilityCtx: TourEligibilityContext = {
    canShowAi,
    canAutoAdd: canShowAi,
  };

  const isActive = activeChapterId !== null && activeStepId !== null;
  const activeStep =
    activeChapterId && activeStepId
      ? chapterSteps(activeChapterId).find((step) => step.id === activeStepId) ?? null
      : null;

  const persistResume = (chapterId: TourChapterId, stepId: string, listId: string | null) => {
    writeTourResume({
      chapterId,
      stepId,
      ...(listId ? { createdListId: listId } : {}),
    });
  };

  /** Leave the sample list: block reopen, navigate first, then tear down fixtures. */
  const leaveDemoSession = () => {
    blockDemoRouteRef.current = true;
    navigate('/dashboard', { replace: true });
    demo.deactivate();
  };

  const startChapter = async (id: TourChapterId) => {
    const steps = chapterSteps(id);
    if (steps.length === 0) {
      return;
    }

    if (id !== 'demo' && (activeChapterId === 'demo' || demo.active || isDemoListPath(location.pathname))) {
      leaveDemoSession();
    }

    if (id === 'demo' && user?.Id) {
      blockDemoRouteRef.current = false;
      const ownerName = user.FirstName?.trim() || user.Username;
      demo.activate(user.Id, ownerName);
    }

    const first = steps[0];
    setActiveChapterId(id);
    setActiveStepId(first.id);
    persistResume(id, first.id, createdListId);
  };

  const startAtStep = async (chapterId: TourChapterId, stepId: string, listId?: string) => {
    const steps = chapterSteps(chapterId);
    if (steps.length === 0) {
      return;
    }

    if (chapterId !== 'demo' && (activeChapterId === 'demo' || demo.active || isDemoListPath(location.pathname))) {
      leaveDemoSession();
    }

    if (chapterId === 'demo' && user?.Id) {
      if (stepNeedsDemoList(steps.find((step) => step.id === stepId) ?? steps[0])) {
        blockDemoRouteRef.current = false;
      }
      const ownerName = user.FirstName?.trim() || user.Username;
      demo.activate(user.Id, ownerName);
    }

    const migratedStepId =
      stepId === 'beginner-create-fab-action' ? 'beginner-create' : stepId;
    const resolved = steps.some((step) => step.id === migratedStepId)
      ? migratedStepId
      : steps[0].id;
    if (listId) {
      setCreatedListId(listId);
    }

    const resolvedStep = steps.find((step) => step.id === resolved);
    if (stepNeedsDemoList(resolvedStep) && !blockDemoRouteRef.current) {
      navigate(`/wishlists/${TOUR_DEMO_LIST_ID}`);
    }

    setActiveChapterId(chapterId);
    setActiveStepId(resolved);
    persistResume(chapterId, resolved, listId ?? createdListId);
  };

  const completeChapter = async () => {
    if (!activeChapterId) {
      return;
    }

    const chapterId = activeChapterId;
    const tour = normalizeClientTour(user?.Tour);
    const projected = {
      ...tour,
      Chapters: { ...tour.Chapters, [chapterId]: 'completed' as const },
    };

    if (chapterId === 'demo') {
      const beginnerFirst = chapterSteps('beginner')[0];
      if (!beginnerFirst) {
        return;
      }

      leaveDemoSession();
      persistResume('beginner', beginnerFirst.id, createdListId);
      setActiveChapterId('beginner');
      setActiveStepId(beginnerFirst.id);

      await authApi.patchTutorial({
        CompleteChapter: chapterId,
      });
      await refreshUser();
      return;
    }

    const nextId = nextAdvancedChapterId(
      projected,
      eligibilityCtx,
      chapterId === 'beginner' ? 'beginner' : chapterId
    );

    await authApi.patchTutorial({
      CompleteChapter: chapterId,
      ...(nextId === null ? { FirstRunDismissed: true } : {}),
    });
    await refreshUser();

    if (nextId) {
      await startChapter(nextId);
      return;
    }

    clearTourResume();
    setActiveChapterId(null);
    setActiveStepId(null);
    demo.deactivate();
    navigate('/dashboard', { replace: true });
  };

  const skipChapter = async () => {
    if (!activeChapterId) {
      return;
    }

    const chapterId = activeChapterId;
    const tour = normalizeClientTour(user?.Tour);
    const projected = {
      ...tour,
      Chapters: { ...tour.Chapters, [chapterId]: 'skipped' as const },
    };

    if (chapterId === 'demo') {
      const beginnerFirst = chapterSteps('beginner')[0];
      if (!beginnerFirst) {
        return;
      }

      leaveDemoSession();
      persistResume('beginner', beginnerFirst.id, createdListId);
      setActiveChapterId('beginner');
      setActiveStepId(beginnerFirst.id);

      await authApi.patchTutorial({ SkipChapter: chapterId });
      await refreshUser();
      return;
    }

    const dismissFirstRun = chapterId === 'beginner';
    const nextId = dismissFirstRun
      ? null
      : nextAdvancedChapterId(projected, eligibilityCtx, chapterId);

    await authApi.patchTutorial({
      SkipChapter: chapterId,
      ...(dismissFirstRun || nextId === null ? { FirstRunDismissed: true } : {}),
    });
    await refreshUser();

    if (nextId) {
      await startChapter(nextId);
      return;
    }

    clearTourResume();
    setActiveChapterId(null);
    setActiveStepId(null);
    demo.deactivate();
    navigate('/dashboard', { replace: true });
  };

  const finishTour = async () => {
    const chapterToComplete = activeChapterId;

    clearTourResume();
    setActiveChapterId(null);
    setActiveStepId(null);
    navigate('/dashboard', { replace: true });
    demo.deactivate();

    await authApi.patchTutorial({
      FirstRunDismissed: true,
      ...(chapterToComplete ? { CompleteChapter: chapterToComplete } : {}),
    });
    await refreshUser();
  };

  const restartAll = async () => {
    await authApi.patchTutorial({ ResetAll: true, FirstRunDismissed: false });
    await refreshUser();
    setCreatedListId(null);
    clearTourResume();
    autoStartedRef.current = true;
    await startChapter('demo');
  };

  const next = async () => {
    if (!activeChapterId || !activeStepId || advancingRef.current) {
      return;
    }

    const steps = chapterSteps(activeChapterId);
    const index = steps.findIndex((step) => step.id === activeStepId);
    if (index < 0) {
      return;
    }

    if (index >= steps.length - 1) {
      advancingRef.current = true;
      try {
        await completeChapter();
      } finally {
        advancingRef.current = false;
      }
      return;
    }

    const upcoming = steps[index + 1];
    setActiveStepId(upcoming.id);
    persistResume(activeChapterId, upcoming.id, createdListId);
  };

  const back = () => {
    if (!activeChapterId || !activeStepId) {
      return;
    }

    const steps = chapterSteps(activeChapterId);
    const index = steps.findIndex((step) => step.id === activeStepId);
    if (index <= 0) {
      return;
    }

    const previous = steps[index - 1];
    setActiveStepId(previous.id);
    persistResume(activeChapterId, previous.id, createdListId);
  };

  const skipStep = async () => {
    await next();
  };

  nextRef.current = next;

  const notifyEvent = (event: string, payload?: { listId?: string }) => {
    if (payload?.listId) {
      setCreatedListId(payload.listId);
    }

    if (activeStep?.advanceOn === 'event' && activeStep.advanceEvent === event) {
      void nextRef.current();
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      autoStartedRef.current = false;
      setActiveChapterId(null);
      setActiveStepId(null);
      setCreatedListId(null);
      deactivateRef.current();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!user?.Id || !isAuthenticated || isAuthPath(location.pathname)) {
      return;
    }

    if (autoStartedRef.current || isActive) {
      return;
    }

    const tour = normalizeClientTour(user.Tour);
    if (!shouldAutoStartTour(user.IsOnboarded, tour)) {
      return;
    }

    autoStartedRef.current = true;
    const resume = readTourResume();
    if (resume) {
      if (resume.chapterId === 'demo' && chapterStatus(tour, 'demo') !== 'pending') {
        void startChapter('beginner');
        return;
      }

      void startAtStep(resume.chapterId, resume.stepId, resume.createdListId);
      return;
    }

    const chapterId = firstPendingChapterId(tour, eligibilityCtx);
    if (chapterId) {
      void startChapter(chapterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot auto-start per session
  }, [user?.Id, user?.IsOnboarded, user?.Tour, isAuthenticated, location.pathname, isActive, canShowAi]);

  useLayoutEffect(() => {
    if (!isActive || !activeChapterId || activeChapterId === 'demo') {
      return;
    }

    if (isDemoListPath(location.pathname)) {
      navigate('/dashboard', { replace: true });
    }
  }, [isActive, activeChapterId, location.pathname, navigate]);

  useEffect(() => {
    if (!activeStep || !activeChapterId || !activeStepId) {
      return;
    }

    const variant = resolveStepVariant(activeStep, isTourMobileViewport());
    const beforeShow =
      activeChapterId === 'demo' && !blockDemoRouteRef.current
        ? variant.beforeShow
        : Array.isArray(variant.beforeShow)
          ? variant.beforeShow.filter((action) => action !== 'navigateDemo')
          : variant.beforeShow === 'navigateDemo'
            ? undefined
            : variant.beforeShow;
    runBeforeShow(beforeShow, navigate);

    if (activeStep.demoBeat) {
      demo.runBeat(activeStep.demoBeat);
    } else {
      demo.clearHighlight();
    }

    persistResume(activeChapterId, activeStepId, createdListId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- drive side effects from step identity
  }, [activeChapterId, activeStepId]);

  useEffect(() => {
    if (!activeStep?.advanceEvent || activeStep.advanceOn !== 'event') {
      return;
    }

    const handler = () => {
      void nextRef.current();
    };

    window.addEventListener(activeStep.advanceEvent, handler);
    return () => window.removeEventListener(activeStep.advanceEvent!, handler);
  }, [activeStep?.id, activeStep?.advanceEvent, activeStep?.advanceOn]);

  useEffect(() => {
    if (!activeStep || activeStep.advanceOn !== 'route' || !activeStep.routeIncludes) {
      return;
    }

    if (location.pathname.includes(activeStep.routeIncludes)) {
      void nextRef.current();
    }
  }, [location.pathname, activeStep?.id, activeStep?.advanceOn, activeStep?.routeIncludes]);

  const value: TourContextType = {
    isActive,
    activeChapterId,
    activeStepId,
    createdListId,
    setCreatedListId,
    startChapter,
    next,
    back,
    skipStep,
    completeChapter,
    skipChapter,
    finishTour,
    restartAll,
    notifyEvent,
    isDemoActive: demo.active,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function TourProvider({ children }: { children: ReactNode }) {
  return (
    <DemoListProvider>
      <TourProviderInner>
        {children}
      </TourProviderInner>
    </DemoListProvider>
  );
}
