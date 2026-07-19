import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from 'features/auth';
import { useAuth } from 'app/providers/auth-context';
import { useTheme } from 'app/providers/theme-context';
import { OnboardingTemplate } from './onboarding.html';
import { OnboardingState } from 'features/auth/interfaces/onboarding-state.interface';
import { OnboardingTimelineStep } from './components/timeline/interfaces/onboarding-timeline-step.interface';

const USER_STEPS = ['hello', 'theme', 'profile'] as const;
const OWNER_STEPS = ['public_url', 'registration', 'mail', 'ai'] as const;
const SKIP_ALLOWED = new Set(['hello', 'theme', 'profile', 'public_url', 'registration', 'mail', 'ai']);

const THEME_OPTIONS = [
  { id: 'default', label: 'Linear', previewBg: '#0f0f10', previewAccent: '#5e6ad2' },
  { id: 'neon', label: 'Neon', previewBg: '#05050a', previewAccent: '#00ffcc' },
  { id: 'cyberpunk', label: 'Cyberpunk', previewBg: '#1a0033', previewAccent: '#ff0055' },
  { id: 'mystic', label: 'Mystic', previewBg: '#0d0b14', previewAccent: '#b829c2' },
  { id: 'burnt-forest', label: 'Burnt Forest', previewBg: '#0f140f', previewAccent: '#e65c00' },
  { id: 'paper', label: 'Paper', previewBg: '#f5f0e6', previewAccent: '#4a5568' },
  { id: 'paper-mario', label: 'Paper Mario', previewBg: '#87ceeb', previewAccent: '#e52521' },
  { id: 'retro-80s', label: "80's Retro", previewBg: '#1a0a2e', previewAccent: '#ff6ec7' },
  { id: 'pixel', label: 'Pixel Art', previewBg: '#1a1c2c', previewAccent: '#e52521' },
  { id: 'matrix', label: 'Matrix', previewBg: '#0d0208', previewAccent: '#00ff41' },
  { id: 'terminal', label: 'Terminal', previewBg: '#0a0a0a', previewAccent: '#ffb000' },
  { id: 'vaporwave', label: 'Vaporwave', previewBg: '#1a0033', previewAccent: '#ff71ce' },
  { id: 'arcade', label: 'Arcade', previewBg: '#1a1a2e', previewAccent: '#ff0040' },
];

const STEP_COPY: Record<string, { title: string; subtitle: string }> = {
  hello: {
    title: 'Welcome to Giftistry',
    subtitle: "Let's get you settled in — it only takes a minute.",
  },
  theme: {
    title: 'Pick your look',
    subtitle: 'Choose a theme that feels like home. You can change it anytime.',
  },
  profile: {
    title: 'Introduce yourself',
    subtitle: 'A name (and optional bio) so friends know who you are.',
  },
  public_url: {
    title: 'Public URL',
    subtitle: 'Where this Giftistry instance lives on the web.',
  },
  registration: {
    title: 'Who can join',
    subtitle: 'Decide how new people create accounts.',
  },
  mail: {
    title: 'Email delivery',
    subtitle: 'How Giftistry sends invites and notifications.',
  },
  ai: {
    title: 'AI features',
    subtitle: 'Optional helpers for gift ideas and product lookup.',
  },
  done: {
    title: "You're ready",
    subtitle: 'Your space is set — time to start sharing wishlists.',
  },
};

const PANEL_LEAVE_MS = 250;

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser, registrationMode } = useAuth();
  const { setTheme } = useTheme();

  const [state, setState] = useState<OnboardingState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleStepId, setVisibleStepId] = useState('hello');
  const [panelPhase, setPanelPhase] = useState<'active' | 'leaving'>('active');

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
      setError('Failed to load onboarding state.');
    });
  }, []);

  const requiresOwnerOnboarding =
    !!state?.RequiresOwnerOnboarding && !!user?.IsOwner;

  const steps = useMemo((): string[] => {
    const list: string[] = [...USER_STEPS];
    if (requiresOwnerOnboarding) {
      list.push(...OWNER_STEPS);
    }
    list.push('done');
    return list;
  }, [requiresOwnerOnboarding]);

  const stepId = steps[stepIndex] ?? 'hello';
  const isOwnerStep = OWNER_STEPS.includes(stepId as (typeof OWNER_STEPS)[number]);
  const copy = STEP_COPY[stepId] ?? { title: 'Welcome', subtitle: '' };

  const timelineSteps: OnboardingTimelineStep[] = useMemo(
    () =>
      steps
        .filter((id) => id !== 'done')
        .map((id) => ({
          id,
          title: STEP_COPY[id]?.title ?? id,
        })),
    [steps],
  );

  const timelineActiveIndex = stepId === 'done' ? timelineSteps.length : stepIndex;

  useEffect(() => {
    if (stepId === visibleStepId) {
      return;
    }

    setPanelPhase('leaving');
    const timer = window.setTimeout(() => {
      setVisibleStepId(stepId);
      setPanelPhase('active');
    }, PANEL_LEAVE_MS);

    return () => window.clearTimeout(timer);
  }, [stepId, visibleStepId]);

  const handleFieldChange = (field: string, value: string | boolean) => {
    setError(null);
    switch (field) {
      case 'firstName':
        setFirstName(String(value));
        break;
      case 'lastName':
        setLastName(String(value));
        break;
      case 'bio':
        setBio(String(value));
        break;
      case 'theme':
        setThemeChoice(String(value));
        setTheme(String(value) as Parameters<typeof setTheme>[0]);
        break;
      case 'publicAppUrl':
        setPublicAppUrl(String(value));
        break;
      case 'registrationMode':
        setRegistrationModeChoice(value as typeof registrationMode);
        break;
      case 'smtpType':
        setSmtpType(value as 'local' | 'remote');
        break;
      case 'smtpHost':
        setSmtpHost(String(value));
        break;
      case 'smtpPort':
        setSmtpPort(String(value));
        break;
      case 'smtpFrom':
        setSmtpFrom(String(value));
        break;
      case 'aiEnabled':
        setAiEnabled(Boolean(value));
        break;
      case 'aiWebSearchEnabled':
        setAiWebSearchEnabled(Boolean(value));
        break;
      default:
        break;
    }
  };

  const handleGlowMove = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  };

  const persistStep = async (options?: { skip?: boolean }) => {
    const payload: Record<string, unknown> = {};

    if (stepId === 'profile') {
      payload.FirstName = firstName;
      payload.LastName = lastName;
      payload.Bio = bio;
    }
    if (stepId === 'theme') {
      payload.Theme = theme;
    }
    if (stepId === 'public_url') {
      payload.PublicAppUrl = publicAppUrl.trim();
    }
    if (stepId === 'registration') {
      payload.RegistrationMode = registrationModeChoice;
    }
    if (stepId === 'mail') {
      payload.SmtpType = smtpType;
      payload.SmtpHost = smtpHost;
      payload.SmtpPort = Number(smtpPort) || 587;
      payload.SmtpFrom = smtpFrom;
    }
    if (stepId === 'ai') {
      payload.AiEnabled = aiEnabled;
      payload.AiWebSearchEnabled = aiWebSearchEnabled;
    }

    if (options?.skip && isOwnerStep) {
      payload.CompleteOwner = true;
      payload.SkipOwner = true;
    } else if (stepId === 'ai' && isOwnerStep) {
      payload.CompleteOwner = true;
      Object.assign(payload, {
        PublicAppUrl: publicAppUrl.trim(),
        RegistrationMode: registrationModeChoice,
        SmtpType: smtpType,
        SmtpHost: smtpHost,
        SmtpPort: Number(smtpPort) || 587,
        SmtpFrom: smtpFrom,
        AiEnabled: aiEnabled,
        AiWebSearchEnabled: aiWebSearchEnabled,
      });
    } else if (Object.keys(payload).length > 0) {
      await authApi.patchOnboarding(payload);
    }

    if (stepId === 'profile' || stepId === 'theme') {
      await authApi.patchOnboarding({
        FirstName: firstName,
        LastName: lastName,
        Bio: bio,
        Theme: theme,
      });
    }
  };

  const finishUserOnboarding = async () => {
    await authApi.patchOnboarding({ CompleteUser: true });
    await refreshUser();
  };

  const handleNext = async () => {
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
          await authApi.patchOnboarding({
            CompleteOwner: true,
            PublicAppUrl: publicAppUrl.trim(),
            RegistrationMode: registrationModeChoice,
            SmtpType: smtpType,
            SmtpHost: smtpHost,
            SmtpPort: Number(smtpPort) || 587,
            SmtpFrom: smtpFrom,
            AiEnabled: aiEnabled,
            AiWebSearchEnabled: aiWebSearchEnabled,
          });
        }
        setStepIndex(stepIndex + 1);
        return;
      }

      setStepIndex(stepIndex + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save onboarding step.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (panelPhase === 'leaving') return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (isOwnerStep) {
        await authApi.patchOnboarding({ CompleteOwner: true, SkipOwner: true });
      }
      if (stepIndex >= steps.length - 2) {
        setStepIndex(steps.length - 1);
      } else {
        setStepIndex(stepIndex + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip step.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingTemplate
      step={stepIndex}
      totalSteps={steps.length}
      stepId={stepId}
      visibleStepId={visibleStepId}
      panelPhase={panelPhase}
      title={copy.title}
      subtitle={copy.subtitle}
      timelineSteps={timelineSteps}
      timelineActiveIndex={timelineActiveIndex}
      requiresOwner={requiresOwnerOnboarding}
      isSubmitting={isSubmitting}
      error={error}
      canSkip={SKIP_ALLOWED.has(stepId)}
      firstName={firstName}
      lastName={lastName}
      bio={bio}
      theme={theme}
      themeOptions={THEME_OPTIONS}
      publicAppUrl={publicAppUrl}
      registrationMode={registrationModeChoice}
      smtpType={smtpType}
      smtpHost={smtpHost}
      smtpPort={smtpPort}
      smtpFrom={smtpFrom}
      aiEnabled={aiEnabled}
      aiWebSearchEnabled={aiWebSearchEnabled}
      state={state}
      onFieldChange={handleFieldChange}
      onNext={handleNext}
      onSkip={handleSkip}
      onBack={() => {
        if (panelPhase === 'leaving') return;
        setStepIndex(Math.max(0, stepIndex - 1));
      }}
      onGlowMove={handleGlowMove}
    />
  );
};

export default Onboarding;
