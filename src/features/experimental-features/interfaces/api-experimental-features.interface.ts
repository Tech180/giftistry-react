import type { ExperimentalFeatureId } from './experimental-feature-id.type';

/** Wire shape from /api/auth/me and PATCH bodies (PascalCase keys). */
export type ApiExperimentalFeatures = Partial<Record<string, boolean>> & {
  ProductTutorial?: boolean;
};

export type ApiExperimentalFeatureKey = 'ProductTutorial';

export const API_KEY_BY_FEATURE_ID: Record<ExperimentalFeatureId, ApiExperimentalFeatureKey> = {
  productTutorial: 'ProductTutorial',
};
