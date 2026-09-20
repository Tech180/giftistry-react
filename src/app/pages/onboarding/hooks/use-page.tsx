import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'features/auth';
import { useTheme } from 'app/providers/theme';
import { loadThemePreviews } from 'core/theme/load-theme-previews.util';
import { resolveAppearance } from 'core/theme/resolve-appearance.util';
import { getStandardThemes } from 'core/theme/utils/theme-catalog.util';
import { authApi } from 'features/auth';
import type { OnboardingState } from 'features/auth/interfaces/onboarding-state.interface';
import {
  FAILED_LOAD_STATE,
  FAILED_SAVE_STEP,
  FAILED_SKIP_STEP,
} from '../constants/fallback-messages.constant';
import { PANEL_LEAVE_MS } from '../constants/panel-leave-ms.constant';
import type { FieldName } from '../interfaces/field-name.type';
import type { PanelPhase } from '../interfaces/panel-phase.type';
import type { StepId } from '../interfaces/step-id.type';
import type { ThemeOption } from '../interfaces/theme-option.interface';
import type { UsePageResult } from '../interfaces/use-page-result.interface';
import { applyGlowPointer } from '../utils/apply-glow-pointer.util';
import {
  buildOwnerCompletePayload,
  buildPersistPayload,
} from '../utils/build-persist-payload.util';
import { buildSteps } from '../utils/build-steps.util';
import { getPrimaryCtaLabel } from '../utils/get-primary-cta-label.util';
import { getStepCopy } from '../utils/get-step-copy.util';
import { isOwnerStep as checkIsOwnerStep } from '../utils/is-owner-step.util';
import { isSkipAllowed } from '../utils/is-skip-allowed.util';
import { toThemeOptions } from '../utils/to-theme-options.util';

export function usePage(): UsePageResult {
  const navigate = useNavigate();
  const { user, refreshUser, registrationMode } = useAuth();
  const { setTheme, appearance } = useTheme();

  const [state, setState] = useState<OnboardingState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleStepId, setVisibleStepId] = useState<StepId>('hello');
  const [panelPhase, setPanelPhase] = useState<PanelPhase>('active');
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>([]);

  const [firstName, setFirstName] = useState(user?.FirstName || '');
  const [lastName, setLastName] = useState(user?.LastName || '');
  const [bio, setBio] = useState(user?.Bio || '');
  const [theme, setThemeChoice] = useState(user?.Theme || 'default');
  const [publicAppUrl, setPublicAppUrl] = useState('http://localhost:3000');
  const [registrationModeChoice, setRegistrationModeChoice] = useState(registrationMode);
  const [smtpType, setSmtpType] = useState<'local' | 'remote'>('local');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpFrom, setSmtpFrom] = useState('noreply@giftistry.local');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiWebSearchEnabled, setAiWebSearchEnabled] = useState(false);

  useEffect(() => {
    authApi.getOnboardingState().then(setState).catch(() => {
      setError(FAILED_LOAD_STATE);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const effective = resolveAppearance(appearance);

    void loadThemePreviews(getStandardThemes(), effective).then((previews) => {
      if (!cancelled) {
        setThemeOptions(toThemeOptions(previews));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [appearance]);

  const requiresOwnerOnboarding = !!state?.RequiresOwnerOnboarding && !!user?.IsOwner;
  const steps = buildSteps(requiresOwnerOnboarding);
  const stepId = steps[stepIndex] ?? 'hello';
  const ownerStep = checkIsOwnerStep(stepId);
  const copy = getStepCopy(stepId);

  const timelineSteps = steps
    .filter((id) => id !== 'done')
    .map((id) => ({
      id,
      title: getStepCopy(id).title,
    }));

  const timelineActiveIndex = stepId === 'done' ? timelineSteps.length : stepIndex;

  useEffect(() => {
    if (stepId === visibleStepId) return;

    setPanelPhase('leaving');
    const timer = window.setTimeout(() => {
      setVisibleStepId(stepId);
      setPanelPhase('active');
    }, PANEL_LEAVE_MS);

    return () => window.clearTimeout(timer);
  }, [stepId, visibleStepId]);

  const formState = {
    firstName,
    lastName,
    bio,
    theme,
    publicAppUrl,
    registrationMode: registrationModeChoice,
    smtpType,
    smtpHost,
    smtpPort,
    smtpFrom,
    aiEnabled,
    aiWebSearchEnabled,
  };

  const onFieldChange = (field: FieldName, value: string | boolean) => {
    setError(null);
    const setters: Record<FieldName, (next: string | boolean) => void> = {
      firstName: (next) => setFirstName(String(next)),
      lastName: (next) => setLastName(String(next)),
      bio: (next) => setBio(String(next)),
      theme: (next) => {
        const id = String(next);
        setThemeChoice(id);
        setTheme(id as Parameters<typeof setTheme>[0]);
      },
      publicAppUrl: (next) => setPublicAppUrl(String(next)),
      registrationMode: (next) => setRegistrationModeChoice(next as typeof registrationMode),
      smtpType: (next) => setSmtpType(next as 'local' | 'remote'),
      smtpHost: (next) => setSmtpHost(String(next)),
      smtpPort: (next) => setSmtpPort(String(next)),
      smtpFrom: (next) => setSmtpFrom(String(next)),
      aiEnabled: (next) => setAiEnabled(Boolean(next)),
      aiWebSearchEnabled: (next) => setAiWebSearchEnabled(Boolean(next)),
    };
    setters[field](value);
  };

  const onGlowMove = (event: MouseEvent<HTMLElement>) => {
    applyGlowPointer(event);
  };

  const persistStep = async (options?: { skip?: boolean }) => {
    const payload = buildPersistPayload({
      stepId,
      form: formState,
      isOwnerStep: ownerStep,
      skip: options?.skip,
    });
    if (payload) await authApi.patchOnboarding(payload);
  };

  const finishUserOnboarding = async () => {
    await authApi.patchOnboarding({ CompleteUser: true });
    await refreshUser();
  };

  const onNext = async () => {
    if (panelPhase === 'leaving') return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (stepId === 'done') {
        await finishUserOnboarding();
        navigate('/dashboard', { replace: true });
        return;
      }

      await persistStep();

      if (stepIndex >= steps.length - 2) {
        if (requiresOwnerOnboarding && stepId === 'ai') {
          await authApi.patchOnboarding(buildOwnerCompletePayload(formState));
        }
        setStepIndex(stepIndex + 1);
        return;
      }

      setStepIndex(stepIndex + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : FAILED_SAVE_STEP);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSkip = async () => {
    if (panelPhase === 'leaving') return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (ownerStep) {
        await authApi.patchOnboarding({ CompleteOwner: true, SkipOwner: true });
      }
      if (stepIndex >= steps.length - 2) {
        setStepIndex(steps.length - 1);
      } else {
        setStepIndex(stepIndex + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : FAILED_SKIP_STEP);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBack = () => {
    if (panelPhase === 'leaving') return;
    setStepIndex(Math.max(0, stepIndex - 1));
  };

  return {
    step: stepIndex,
    totalSteps: steps.length,
    stepId,
    visibleStepId,
    panelPhase,
    title: copy.title,
    subtitle: copy.subtitle,
    timelineSteps,
    timelineActiveIndex,
    requiresOwner: requiresOwnerOnboarding,
    isSubmitting,
    error,
    canSkip: isSkipAllowed(stepId),
    primaryCtaLabel: getPrimaryCtaLabel(stepId),
    firstName,
    lastName,
    bio,
    theme,
    themeOptions,
    publicAppUrl,
    registrationMode: registrationModeChoice,
    smtpType,
    smtpHost,
    smtpPort,
    smtpFrom,
    aiEnabled,
    aiWebSearchEnabled,
    onFieldChange,
    onNext,
    onSkip,
    onBack,
    onGlowMove,
  };
}
