import type { ReactNode } from 'react';
import type { SpotlightFeature } from './spotlight-feature.interface';
import type { SpotlightMode } from './spotlight-mode.type';
import type { SpotlightProgress } from './spotlight-progress.interface';
import type { SpotlightRect } from './spotlight-rect.interface';

export type SpotlightPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center';

export interface SpotlightProps {
  targetRect: SpotlightRect | null;
  title: string;
  body: string;
  mode?: SpotlightMode;
  progress?: SpotlightProgress;
  placement?: SpotlightPlacement;
  showNext?: boolean;
  nextLabel?: string;
  showBack?: boolean;
  showSkip?: boolean;
  skipLabel?: string;
  isDialog?: boolean;
  /** Soft cue when the user must click / type in the highlighted control (no Next). */
  interactionHint?: string;
  /** When false, dimming is visual only so nearby form fields stay usable. */
  lockOutside?: boolean;
  pad?: number;
  /** Extra cutouts (no card anchoring) so secondary controls stay undimmed. */
  extraRects?: SpotlightRect[];
  onNext?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  footerExtra?: ReactNode;
  /** Welcome mode */
  features?: SpotlightFeature[];
  tutorialEnabled?: boolean;
  onTutorialEnabledChange?: (enabled: boolean) => void;
  onStart?: () => void;
  onClose?: () => void;
  startLabel?: string;
  closeLabel?: string;
  tutorialToggleLabel?: string;
  /** Interstitial mode */
  continueLabel?: string;
  exitLabel?: string;
  onContinue?: () => void;
  onExit?: () => void;
}
