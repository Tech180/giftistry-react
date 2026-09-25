import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Gift, ListPlus, Users } from 'lucide-react';
import { useAuth } from 'features/auth';
import { measureElement, type SpotlightFeature, type SpotlightMode, type SpotlightPlacement, type SpotlightRect } from 'shared/ui';
import { eligibleChapters } from '../../constants/chapters.constant';
import { stepsForChapter } from '../../constants/steps.constant';
import { TOUR_DEMO_LIST_ID, TOUR_TARGETS } from '../../constants/targets.constant';
import { TOUR_WELCOME_FEATURES } from '../../constants/welcome-features.constant';
import { useTour } from '../../providers/context';
import { buildChapterProgressBar } from '../../utils/chapter-progress-bar.util';
import { isDemoListPath } from '../../utils/is-demo-list-id.util';
import { shouldAdvanceOnInputValue } from '../../utils/should-advance-on-input.util';
import { isTourMobileViewport, resolveStepVariant } from '../../utils/resolve-variant.util';
import { ensureFabOpen } from '../../providers/utils/run-before-show.util';
import { HostTemplate } from './host.html';
import type { Props } from './interfaces/props.interface';

const MISSING_TARGET_POLL_MS = 120;
const SCROLL_RETRY_MS = 600;
const INPUT_ADVANCE_DEBOUNCE_MS = 300;
const PREPARING_DEMO_TIMEOUT_MS = 8000;
const ATTENTION_PULSE_CLASS = 'attention-pulse';

/** Secondary cutouts kept undimmed alongside the primary spotlight target. */
const TOUR_EXTRA_TARGETS: Partial<Record<string, string[]>> = {
  [TOUR_TARGETS.addItemName]: [TOUR_TARGETS.addItemSave],
};

const WELCOME_FEATURE_ICONS = {
  gift: Gift,
  'list-plus': ListPlus,
  users: Users,
} as const;

export const Host: React.FC<Props> = () => {
  const tour = useTour();
  const navigate = useNavigate();
  const location = useLocation();
  const { canShowAi } = useAuth();
  const {
    isActive,
    activeChapterId,
    activeStepId,
    next,
    back,
    skipChapter,
    finishTour,
  } = tour;

  const nextRef = useRef(next);
  nextRef.current = next;

  const [targetRect, setTargetRect] = useState<SpotlightRect | null>(null);
  const [extraRects, setExtraRects] = useState<SpotlightRect[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [tutorialEnabled, setTutorialEnabled] = useState(true);
  const [isPreparingDemo, setIsPreparingDemo] = useState(false);

  const steps = activeChapterId ? stepsForChapter(activeChapterId) : [];
  const stepIndex = steps.findIndex((step) => step.id === activeStepId);
  const step = stepIndex >= 0 ? steps[stepIndex] : null;

  const variant = step ? resolveStepVariant(step, isTourMobileViewport()) : {};
  const target = variant.target;
  const placement: SpotlightPlacement =
    variant.placement ?? (step?.center || step?.isDialog || step?.isWelcome || step?.isChapterEnd ? 'center' : 'bottom');

  const mode: SpotlightMode = step?.isWelcome
    ? 'welcome'
    : step?.isChapterEnd
      ? 'interstitial'
      : 'step';

  const chapters = eligibleChapters({ canShowAi, canAutoAdd: canShowAi });
  const progress =
    mode === 'step' && activeChapterId && activeStepId
      ? buildChapterProgressBar({
          eligibleChapters: chapters,
          activeChapterId,
          steps,
          activeStepId,
        })
      : undefined;

  const welcomeFeatures: SpotlightFeature[] = TOUR_WELCOME_FEATURES.map((feature) => {
    const Icon = WELCOME_FEATURE_ICONS[feature.icon];
    return {
      title: feature.title,
      description: feature.description,
      icon: (
        <Icon
          size = {
            18
          }
          aria-hidden = {
            true
          }
        />
      ),
    };
  });

  // Do not hunt for dashboard targets while still (briefly) on the sample list.
  const skipTargetOnWrongPage =
    activeChapterId !== 'demo' && isDemoListPath(location.pathname);

  useEffect(() => {
    if (!isActive || !target || skipTargetOnWrongPage) {
      setTargetRect(null);
      setExtraRects([]);
      setIsLocating(false);
      return;
    }

    let cancelled = false;
    let scrolledFor: Element | null = null;
    let lastScrollAt = 0;
    setIsLocating(true);

    const extraIds = TOUR_EXTRA_TARGETS[target] ?? [];

    const queryPrimary = () => document.querySelector(`[data-tour="${target}"]`);
    const queryExtras = () =>
      extraIds
        .map((id) => document.querySelector(`[data-tour="${id}"]`))
        .filter((element): element is Element => element !== null);

    const measure = () => {
      if (cancelled) {
        return { primary: null as Element | null, extras: [] as Element[] };
      }

      const primary = queryPrimary();
      const extras = queryExtras();
      const rect = measureElement(primary);
      setTargetRect(rect);
      setExtraRects(
        extras
          .map((element) => measureElement(element))
          .filter((extra): extra is SpotlightRect => extra !== null)
      );
      if (rect) {
        setIsLocating(false);
      }

      return { primary, extras };
    };

    const ensureVisible = (element: Element) => {
      const now = Date.now();
      if (element === scrolledFor && now - lastScrollAt < SCROLL_RETRY_MS) {
        return;
      }

      scrolledFor = element;
      lastScrollAt = now;
      element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      window.setTimeout(() => {
        if (!cancelled) {
          measure();
        }
      }, 280);
    };

    measure();

    if (
      target === TOUR_TARGETS.createWishlistFabAction ||
      target === TOUR_TARGETS.shareFab ||
      target === TOUR_TARGETS.importFab ||
      target === TOUR_TARGETS.settingsFab ||
      target === TOUR_TARGETS.commentsFab
    ) {
      ensureFabOpen(() => {
        const el = document.querySelector(`[data-tour="${target}"]`);
        return Boolean(el && measureElement(el));
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    const observeAll = (primary: Element | null, extras: Element[]) => {
      resizeObserver.disconnect();
      if (primary) {
        resizeObserver.observe(primary);
        ensureVisible(primary);
      }
      for (const element of extras) {
        resizeObserver.observe(element);
      }
    };

    {
      const { primary, extras } = measure();
      observeAll(primary, extras);
    }

    const onScrollOrResize = () => {
      measure();
    };

    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);

    const pollId = window.setInterval(() => {
      const { primary, extras } = measure();
      if (!primary || !measureElement(primary)) {
        return;
      }

      // Wait for optional companion cutouts (e.g. Add beside the name field).
      if (extraIds.length > 0 && extras.length < extraIds.length) {
        return;
      }

      observeAll(primary, extras);
      window.clearInterval(pollId);
    }, MISSING_TARGET_POLL_MS);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      window.clearInterval(pollId);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [isActive, target, activeStepId, skipTargetOnWrongPage]);

  useEffect(() => {
    if (!isActive || !target || step?.advanceOn !== 'target' || skipTargetOnWrongPage) {
      return;
    }

    let pulsed: Element | null = null;

    const applyPulse = () => {
      const element = document.querySelector(`[data-tour="${target}"]`);
      if (!element || !measureElement(element)) {
        return false;
      }

      if (element !== pulsed) {
        pulsed?.classList.remove(ATTENTION_PULSE_CLASS);
        element.classList.add(ATTENTION_PULSE_CLASS);
        pulsed = element;
      }

      return true;
    };

    applyPulse();
    const pollId = window.setInterval(() => {
      if (applyPulse()) {
        window.clearInterval(pollId);
      }
    }, MISSING_TARGET_POLL_MS);

    return () => {
      window.clearInterval(pollId);
      pulsed?.classList.remove(ATTENTION_PULSE_CLASS);
    };
  }, [isActive, target, step?.advanceOn, activeStepId, skipTargetOnWrongPage]);

  useEffect(() => {
    if (!isActive || !step || step.advanceOn !== 'target' || !target) {
      return;
    }

    let advanced = false;

    const onActivate = (event: Event) => {
      if (advanced) {
        return;
      }

      const eventTarget = event.target;
      if (!(eventTarget instanceof Element)) {
        return;
      }

      if (!eventTarget.closest(`[data-tour="${target}"]`)) {
        return;
      }

      advanced = true;
      void nextRef.current();
    };

    window.addEventListener('pointerup', onActivate, true);
    window.addEventListener('click', onActivate, true);
    return () => {
      window.removeEventListener('pointerup', onActivate, true);
      window.removeEventListener('click', onActivate, true);
    };
  }, [isActive, step, target]);

  useEffect(() => {
    if (!isActive || !step || step.advanceOn !== 'input' || !target) {
      return;
    }

    let advanced = false;
    let timer: number | undefined;

    const readValue = (element: Element): string => {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        return element.value;
      }

      const nested = element.querySelector('input, textarea');
      if (nested instanceof HTMLInputElement || nested instanceof HTMLTextAreaElement) {
        return nested.value;
      }

      return '';
    };

    const onInput = (event: Event) => {
      if (advanced) {
        return;
      }

      const eventTarget = event.target;
      if (!(eventTarget instanceof Element)) {
        return;
      }

      const field = eventTarget.closest(`[data-tour="${target}"]`);
      if (!field) {
        return;
      }

      const value = readValue(field);
      if (!shouldAdvanceOnInputValue(value)) {
        return;
      }

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (advanced) {
          return;
        }

        advanced = true;
        void nextRef.current();
      }, INPUT_ADVANCE_DEBOUNCE_MS);
    };

    window.addEventListener('input', onInput, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('input', onInput, true);
    };
  }, [isActive, step, target]);

  useEffect(() => {
    if (step?.isWelcome) {
      setTutorialEnabled(true);
    }
  }, [step?.id, step?.isWelcome]);

  useEffect(() => {
    if (!isActive) {
      setIsPreparingDemo(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isPreparingDemo) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsPreparingDemo(false);
    }, PREPARING_DEMO_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isPreparingDemo]);

  useEffect(() => {
    if (!isPreparingDemo || !step || step.isWelcome) {
      return;
    }

    if (!isDemoListPath(location.pathname)) {
      return;
    }

    // Wait until the sample list surface is painted and the step target is measurable.
    if (target && !targetRect) {
      return;
    }

    setIsPreparingDemo(false);
  }, [isPreparingDemo, step, location.pathname, target, targetRect]);

  if (!isActive || !step || !activeChapterId) {
    return null;
  }

  const showNext =
    mode === 'step' &&
    Boolean(step.isDialog || step.advanceOn === 'next' || step.advanceOn == null);
  const showBack = mode === 'step' && step.showBack === true && stepIndex > 0;
  const needsUserAction =
    step.advanceOn === 'target' ||
    step.advanceOn === 'input' ||
    step.advanceOn === 'route' ||
    step.advanceOn === 'event';

  const interactionHint = (() => {
    if (mode !== 'step') {
      return undefined;
    }

    if (isLocating && target && !targetRect && !step.center && !step.isDialog) {
      return 'Finding that control…';
    }

    if (!needsUserAction || showNext) {
      return undefined;
    }

    if (step.hintText) {
      return step.hintText;
    }

    if (step.advanceOn === 'target') {
      return 'Click the highlighted control to continue';
    }

    if (step.advanceOn === 'input') {
      return 'Type in the highlighted field to continue';
    }

    if (step.advanceOn === 'route') {
      return 'Open the highlighted item to continue';
    }

    return 'Finish the highlighted action to continue';
  })();

  const handleSkip = () => {
    // Footer "Exit" ends the whole tour (leave demo → dashboard, dismiss spotlight).
    if (!step.isDialog && !step.isWelcome && !step.isChapterEnd) {
      void finishTour();
      return;
    }

    if (step.id === 'beginner-welcome') {
      void finishTour();
      return;
    }

    void skipChapter();
  };

  const handleWelcomeStart = () => {
    if (activeChapterId === 'demo') {
      setIsPreparingDemo(true);
      navigate(`/wishlists/${TOUR_DEMO_LIST_ID}`);
    }
    void next();
  };

  const handleWelcomeClose = () => {
    void finishTour();
  };

  const handleInterstitialContinue = () => {
    void next();
  };

  const handleInterstitialExit = () => {
    void finishTour();
  };

  const skipLabel = mode === 'step' ? (step.isDialog ? (step.skipLabel ?? 'Skip') : 'Exit') : (step.skipLabel ?? 'Skip');
  const lockOutside = step.advanceOn !== 'event' && step.advanceOn !== 'input';

  return (
    <HostTemplate
      isActive = {
        isActive
      }
      isPreparing = {
        isPreparingDemo
      }
      mode = {
        mode
      }
      targetRect = {
        step.center || step.isDialog || step.isWelcome || step.isChapterEnd ? null : targetRect
      }
      extraRects = {
        step.center || step.isDialog || step.isWelcome || step.isChapterEnd ? [] : extraRects
      }
      title = {
        step.title
      }
      body = {
        step.body
      }
      progress = {
        progress
      }
      placement = {
        placement
      }
      showNext = {
        showNext
      }
      nextLabel = {
        step.nextLabel ?? 'Next'
      }
      showBack = {
        showBack
      }
      showSkip = {
        mode === 'step'
      }
      skipLabel = {
        skipLabel
      }
      isDialog = {
        Boolean(step.isDialog || step.isWelcome || step.isChapterEnd)
      }
      interactionHint = {
        interactionHint
      }
      lockOutside = {
        lockOutside
      }
      features = {
        welcomeFeatures
      }
      tutorialEnabled = {
        tutorialEnabled
      }
      onTutorialEnabledChange = {
        setTutorialEnabled
      }
      startLabel = {
        step.nextLabel ?? 'Start tutorial'
      }
      closeLabel = {
        step.skipLabel ?? 'Close'
      }
      tutorialToggleLabel = {
        'Include hands-on tutorial'
      }
      continueLabel = {
        step.nextLabel ?? 'Continue'
      }
      exitLabel = {
        step.skipLabel ?? 'I’m done for now'
      }
      onNext = {
        () => {
          void next();
        }
      }
      onBack = {
        back
      }
      onSkip = {
        handleSkip
      }
      onStart = {
        handleWelcomeStart
      }
      onClose = {
        handleWelcomeClose
      }
      onContinue = {
        handleInterstitialContinue
      }
      onExit = {
        handleInterstitialExit
      }
    />
  );
};
