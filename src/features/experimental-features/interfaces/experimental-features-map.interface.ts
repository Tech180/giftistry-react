import type { ExperimentalFeatureId } from './experimental-feature-id.type';

export type ExperimentalFeaturesMap = Partial<Record<ExperimentalFeatureId, boolean>>;
