import { EXPERIMENTAL_FEATURES } from '../constants/experimental-features.constant';

export type ExperimentalFeatureId = (typeof EXPERIMENTAL_FEATURES)[number]['id'];
