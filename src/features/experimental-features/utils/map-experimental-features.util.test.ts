import { describe, expect, it } from 'vitest';
import { isExperimentalFeatureEnabledForUser } from './is-experimental-feature-enabled-for-user.util';
import {
  mapExperimentalFeaturesFromApi,
  mapExperimentalFeaturesToApi,
} from './map-experimental-features.util';

describe('mapExperimentalFeatures', () => {
  it('maps PascalCase wire keys to client ids', () => {
    expect(mapExperimentalFeaturesFromApi({ ProductTutorial: true })).toEqual({
      productTutorial: true,
    });
    expect(mapExperimentalFeaturesFromApi({})).toEqual({});
    expect(mapExperimentalFeaturesFromApi(null)).toEqual({});
  });

  it('maps client ids to PascalCase wire keys', () => {
    expect(mapExperimentalFeaturesToApi({ productTutorial: false })).toEqual({
      ProductTutorial: false,
    });
  });
});

describe('isExperimentalFeatureEnabledForUser', () => {
  it('reads ProductTutorial from user ExperimentalFeatures', () => {
    expect(isExperimentalFeatureEnabledForUser('productTutorial')).toBe(false);
    expect(
      isExperimentalFeatureEnabledForUser('productTutorial', { ProductTutorial: true })
    ).toBe(true);
  });
});
