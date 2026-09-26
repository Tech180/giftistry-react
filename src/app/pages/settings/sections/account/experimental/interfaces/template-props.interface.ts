import type { ExperimentalFeatureId } from 'features/experimental-features';
import { EXPERIMENTAL_FEATURES } from 'features/experimental-features';

export interface TemplateProps {
  definitions: typeof EXPERIMENTAL_FEATURES;
  isEnabled: (id: ExperimentalFeatureId) => boolean;
  isSaving: boolean;
  productTutorialEnabled: boolean;
  onToggle: (id: ExperimentalFeatureId, enabled: boolean) => void;
}
