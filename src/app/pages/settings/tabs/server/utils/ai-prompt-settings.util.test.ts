import { describe, expect, test, vi } from 'vitest';
import {
  applyAiPromptSettings,
  effectiveAiPrompt,
  getDefaultPromptForType,
} from './ai-prompt-settings.util';

const mockDefaults = {
  Review: 'Default review prompt',
  Description: 'Default description prompt',
  Populate: 'Default populate prompt with Oura Ring 5 rules',
  Category: 'Default category prompt',
};

describe('ai-prompt-settings.util', () => {
  test('effectiveAiPrompt uses fallback when saved value is empty', () => {
    expect(effectiveAiPrompt('', mockDefaults.Populate)).toBe(mockDefaults.Populate);
    expect(effectiveAiPrompt('   ', mockDefaults.Populate)).toBe(mockDefaults.Populate);
    expect(effectiveAiPrompt('Custom', mockDefaults.Populate)).toBe('Custom');
  });

  test('applyAiPromptSettings prefills all four prompt fields', () => {
    const setters = {
      setAiPrompt: vi.fn(),
      setAiDescriptionPrompt: vi.fn(),
      setAiPopulatePrompt: vi.fn(),
      setAiCategoryPrompt: vi.fn(),
    };

    applyAiPromptSettings(
      {
        DbType: 'local',
        DbUrl: '',
        SmtpType: 'local',
        SmtpHost: '',
        SmtpPort: 1025,
        SmtpUser: '',
        SmtpPass: '',
        SmtpSecure: false,
        SmtpFrom: '',
        AiPopulatePrompt: 'Saved override',
      },
      mockDefaults,
      setters
    );

    expect(setters.setAiPrompt).toHaveBeenCalledWith(mockDefaults.Review);
    expect(setters.setAiDescriptionPrompt).toHaveBeenCalledWith(mockDefaults.Description);
    expect(setters.setAiPopulatePrompt).toHaveBeenCalledWith('Saved override');
    expect(setters.setAiCategoryPrompt).toHaveBeenCalledWith(mockDefaults.Category);
  });

  test('getDefaultPromptForType returns the matching default', () => {
    expect(getDefaultPromptForType('populate', mockDefaults)).toBe(mockDefaults.Populate);
  });
});
