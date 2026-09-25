import type { CSSProperties, ReactNode, RefObject } from 'react';
import type { SpotlightFeature } from './spotlight-feature.interface';
import type { SpotlightMode } from './spotlight-mode.type';
import type { SpotlightPlacement } from './spotlight-props.interface';
import type { SpotlightProgress } from './spotlight-progress.interface';
import type { SpotlightRect } from './spotlight-rect.interface';

export interface SpotlightTemplateProps {
  targetRect: SpotlightRect | null;
  paddedRect: SpotlightRect | null;
  /** All cutout holes (primary + extras), already padded. */
  cutoutHoles: SpotlightRect[];
  title: string;
  body: string;
  mode: SpotlightMode;
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
  titleId: string;
  cardRef: RefObject<HTMLDivElement | null>;
  cardStyle?: CSSProperties;
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  footerExtra?: ReactNode;
  features: SpotlightFeature[];
  tutorialEnabled: boolean;
  onTutorialEnabledChange?: (enabled: boolean) => void;
  onStart?: () => void;
  onClose?: () => void;
  startLabel: string;
  closeLabel: string;
  tutorialToggleLabel: string;
  continueLabel: string;
  exitLabel: string;
  onContinue?: () => void;
  onExit?: () => void;
}
