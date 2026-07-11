import { resolveCanShowAi, resolveCanShowAiSettings, userPolicyAllowsAi } from './ai-visibility.util';

describe('ai-visibility.util', () => {
  test('resolveCanShowAi requires global AI enabled', () => {
    expect(resolveCanShowAi(false, { Id: '1', AiEnabled: true, Policy: { CanUseAiFeatures: true } } as any)).toBe(false);
  });

  test('resolveCanShowAi respects user opt-out', () => {
    expect(resolveCanShowAi(true, { Id: '1', AiEnabled: false, Policy: { CanUseAiFeatures: true } } as any)).toBe(false);
  });

  test('resolveCanShowAi respects admin policy block', () => {
    expect(resolveCanShowAi(true, { Id: '1', AiEnabled: true, Policy: { CanUseAiFeatures: false } } as any)).toBe(false);
  });

  test('resolveCanShowAi allows when all gates pass', () => {
    expect(resolveCanShowAi(true, { Id: '1', AiEnabled: true, Policy: { CanUseAiFeatures: true } } as any)).toBe(true);
  });

  test('resolveCanShowAiSettings still shows when user opted out', () => {
    expect(
      resolveCanShowAiSettings(true, { Id: '1', AiEnabled: false, Policy: { CanUseAiFeatures: true } } as any)
    ).toBe(true);
  });

  test('resolveCanShowAiSettings hides when server AI is off', () => {
    expect(
      resolveCanShowAiSettings(false, { Id: '1', AiEnabled: true, Policy: { CanUseAiFeatures: true } } as any)
    ).toBe(false);
  });

  test('resolveCanShowAiSettings hides when admin policy blocks AI', () => {
    expect(
      resolveCanShowAiSettings(true, { Id: '1', AiEnabled: true, Policy: { CanUseAiFeatures: false } } as any)
    ).toBe(false);
  });

  test('userPolicyAllowsAi returns false when policy blocks AI', () => {
    expect(userPolicyAllowsAi({ Id: '1', Policy: { CanUseAiFeatures: false } } as any)).toBe(false);
  });
});
