import { EXPERIMENTAL_FEATURES } from '../constants/experimental-features.constant';
import type { ApiExperimentalFeatures } from '../interfaces/api-experimental-features.interface';
import type { ExperimentalFeatureId } from '../interfaces/experimental-feature-id.type';
import type { ExperimentalFeaturesMap } from '../interfaces/experimental-features-map.interface';

export function mapExperimentalFeaturesFromApi(
  api?: ApiExperimentalFeatures | null
): ExperimentalFeaturesMap {
  if (!api) {
    return {};
  }

  const result: ExperimentalFeaturesMap = {};
  for (const feature of EXPERIMENTAL_FEATURES) {
    const value = api[feature.apiKey];
    if (typeof value === 'boolean') {
      result[feature.id] = value;
    }
  }

  return result;
}

export function mapExperimentalFeaturesToApi(
  features: Partial<Record<ExperimentalFeatureId, boolean>>
): ApiExperimentalFeatures {
  const body: ApiExperimentalFeatures = {};
  for (const feature of EXPERIMENTAL_FEATURES) {
    const value = features[feature.id];
    if (typeof value === 'boolean') {
      body[feature.apiKey] = value;
    }
  }

  return body;
}
