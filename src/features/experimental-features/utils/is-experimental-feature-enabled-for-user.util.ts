import type { ExperimentalFeatureId } from '../interfaces/experimental-feature-id.type';
import { isExperimentalFeatureEnabled } from './is-experimental-feature-enabled.util';
import { mapExperimentalFeaturesFromApi } from './map-experimental-features.util';

/** Resolve enablement from `ApiUser.ExperimentalFeatures` (PascalCase wire map). */
export function isExperimentalFeatureEnabledForUser(
  id: ExperimentalFeatureId,
  experimentalFeatures?: Partial<Record<string, boolean>> | null
): boolean {
  return isExperimentalFeatureEnabled(id, mapExperimentalFeaturesFromApi(experimentalFeatures));
}
