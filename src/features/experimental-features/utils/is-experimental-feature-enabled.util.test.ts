import { describe, expect, it } from 'vitest';
import { isExperimentalFeatureEnabled } from './is-experimental-feature-enabled.util';

describe('isExperimentalFeatureEnabled', () => {
  it('defaults productTutorial to false when unset', () => {
    expect(isExperimentalFeatureEnabled('productTutorial')).toBe(false);
    expect(isExperimentalFeatureEnabled('productTutorial', {})).toBe(false);
    expect(isExperimentalFeatureEnabled('productTutorial', null)).toBe(false);
  });

  it('respects explicit true and false overrides', () => {
    expect(isExperimentalFeatureEnabled('productTutorial', { productTutorial: true })).toBe(true);
    expect(isExperimentalFeatureEnabled('productTutorial', { productTutorial: false })).toBe(false);
  });
});
