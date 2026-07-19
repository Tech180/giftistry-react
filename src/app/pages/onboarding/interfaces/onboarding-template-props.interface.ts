import type { MouseEvent } from 'react';
import { OnboardingState } from 'features/auth/interfaces/onboarding-state.interface';
import { OnboardingTimelineStep } from '../components/timeline/interfaces/onboarding-timeline-step.interface';

export interface OnboardingTemplateProps {
  step: number;
  totalSteps: number;
  stepId: string;
  visibleStepId: string;
  panelPhase: 'active' | 'leaving';
  title: string;
  subtitle: string;
  timelineSteps: OnboardingTimelineStep[];
  timelineActiveIndex: number;
  requiresOwner: boolean;
  isSubmitting: boolean;
  error: string | null;
  canSkip: boolean;
  firstName: string;
  lastName: string;
  bio: string;
  theme: string;
  themeOptions: { id: string; label: string; previewBg: string; previewAccent: string }[];
  publicAppUrl: string;
  registrationMode: 'open' | 'invite_only' | 'disabled';
  smtpType: 'local' | 'remote';
  smtpHost: string;
  smtpPort: string;
  smtpFrom: string;
  aiEnabled: boolean;
  aiWebSearchEnabled: boolean;
  state: OnboardingState | null;
  onFieldChange: (field: string, value: string | boolean) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  onGlowMove: (event: MouseEvent<HTMLElement>) => void;
}
