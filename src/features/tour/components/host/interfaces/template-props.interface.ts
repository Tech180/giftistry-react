import type { ReactNode } from 'react';
import type { SpotlightFeature, SpotlightMode, SpotlightPlacement, SpotlightProgress, SpotlightRect } from 'shared/ui';

export interface TemplateProps {
  isActive: boolean;
  isPreparing: boolean;
  mode: SpotlightMode;
  targetRect: SpotlightRect | null;
  extraRects: SpotlightRect[];
  title: string;
  body: string;
  progress?: SpotlightProgress;
  placement: SpotlightPlacement;
  showNext: boolean;
  nextLabel: string;
  showBack: boolean;
  showSkip: boolean;
  skipLabel: string;
  isDialog: boolean;
  interactionHint?: string;
  lockOutside: boolean;
  features: SpotlightFeature[];
  tutorialEnabled: boolean;
  onTutorialEnabledChange: (enabled: boolean) => void;
  startLabel: string;
  closeLabel: string;
  tutorialToggleLabel: string;
  continueLabel: string;
  exitLabel: string;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onStart: () => void;
  onClose: () => void;
  onContinue: () => void;
  onExit: () => void;
  footerExtra?: ReactNode;
}
