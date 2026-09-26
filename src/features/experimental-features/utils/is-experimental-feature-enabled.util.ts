import { EXPERIMENTAL_FEATURES } from '../constants/experimental-features.constant';
import type { ExperimentalFeatureId } from '../interfaces/experimental-feature-id.type';
import type { ExperimentalFeaturesMap } from '../interfaces/experimental-features-map.interface';

export function isExperimentalFeatureEnabled(
  id: ExperimentalFeatureId,
  stored?: ExperimentalFeaturesMap | null
): boolean {
  const definition = EXPERIMENTAL_FEATURES.find((feature) => feature.id === id);
  if (!definition) {
    return false;
  }

  const value = stored?.[id];
  if (typeof value === 'boolean') {
    return value;
  }

  return definition.defaultEnabled;
}
