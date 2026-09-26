import { EXPERIMENTAL_FEATURES } from '../constants/experimental-features.constant';
import type { ExperimentalFeatureId } from './experimental-feature-id.type';
import type { ExperimentalFeaturesMap } from './experimental-features-map.interface';

export interface Result {
  definitions: typeof EXPERIMENTAL_FEATURES;
  features: ExperimentalFeaturesMap;
  isEnabled: (id: ExperimentalFeatureId) => boolean;
  isSaving: boolean;
  onToggle: (id: ExperimentalFeatureId, enabled: boolean) => Promise<void>;
}
