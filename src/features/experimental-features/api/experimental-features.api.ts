import { apiClient } from 'core/api/client';
import type { ApiUser } from 'features/auth';
import type { ApiExperimentalFeatures } from '../interfaces/api-experimental-features.interface';
import type { ExperimentalFeatureId } from '../interfaces/experimental-feature-id.type';
import type { ExperimentalFeaturesMap } from '../interfaces/experimental-features-map.interface';
import {
  mapExperimentalFeaturesFromApi,
  mapExperimentalFeaturesToApi,
} from '../utils/map-experimental-features.util';

export const experimentalFeaturesApi = {
  patchFeatures: async (
    features: Partial<Record<ExperimentalFeatureId, boolean>>
  ): Promise<{
    ExperimentalFeatures: ExperimentalFeaturesMap;
    User?: ApiUser;
  }> => {
    const result = await apiClient.patch<{
      ExperimentalFeatures?: ApiExperimentalFeatures;
      User?: ApiUser;
    }>('/api/auth/experimental-features', mapExperimentalFeaturesToApi(features), 'ExperimentalFeatures');

    return {
      ExperimentalFeatures: mapExperimentalFeaturesFromApi(result?.ExperimentalFeatures),
      User: result?.User,
    };
  },
};
