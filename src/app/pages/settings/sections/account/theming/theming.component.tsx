import React, { useState, useEffect } from 'react';
import { useTheme } from 'app/providers/theme';
import type { CustomThemeProfile } from 'app/providers/theme/interfaces/custom-theme-profile.interface';
import { applyCustomTheme } from 'core/theme/apply-custom-theme';
import { loadThemePreviews } from 'core/theme/load-theme-previews.util';
import { resolveAppearance } from 'core/theme/resolve-appearance.util';
import { getAllPresetThemes, getThemeLabel } from 'core/theme/utils/theme-catalog.util';
import { readComputedAdvancedTokens } from 'core/theme/utils/read-computed-advanced-tokens.util';
import { readComputedThemeColors } from 'core/theme/utils/read-computed-theme-colors.util';
import { ThemingTemplate } from './theming.html';
import { PresetThemeInfo } from './interfaces/preset-theme-info.interface';
import { ThemingProps } from './interfaces/props.interface';
import { getInputWidth } from './utils/get-input-width.util';

export const Theming: React.FC<ThemingProps> = ({ showToast }) => {
  const {
    theme: currentAppTheme,
    appearance,
    setTheme,
    unlockedThemes,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme
  } = useTheme();

  const [activeThemeId, setActiveThemeId] = useState<string>(currentAppTheme);

  const [themeName, setThemeName] = useState('Custom Theme');

  const [colors, setColors] = useState(() => readComputedThemeColors());

  const [advanced, setAdvanced] = useState(() => readComputedAdvancedTokens());

  const [enginePresets, setEnginePresets] = useState<
    { value: string; label: string; primary: string; secondary: string }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    const effective = resolveAppearance(appearance);
    const catalog = getAllPresetThemes();

    void loadThemePreviews(catalog, effective).then((previews) => {
      if (cancelled) {
        return;
      }
      setEnginePresets(
        previews.map((preview) => ({
          value: preview.id,
          label: preview.label,
          primary: preview.primary,
          secondary: preview.bg,
        })),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [appearance]);

  // customThemes sync is handled globally by ThemeContext

  // Synchronize when theme changes from taskbar
  useEffect(() => {
    setActiveThemeId(currentAppTheme);
  }, [currentAppTheme]);

  // Setup active theme fields
  useEffect(() => {
    if (activeThemeId.startsWith('custom-')) {
      const activeCustom = customThemes.find(t => t.id === activeThemeId);
      if (activeCustom) {
        setThemeName(activeCustom.name);
        setColors(activeCustom.colors);
        const fallback = readComputedAdvancedTokens();
        setAdvanced({
          shadows: {
            sm: activeCustom.advanced?.shadows?.sm ?? fallback.shadows.sm,
            md: activeCustom.advanced?.shadows?.md ?? fallback.shadows.md,
            lg: activeCustom.advanced?.shadows?.lg ?? fallback.shadows.lg,
          },
          fonts: {
            sans: activeCustom.advanced?.fonts?.sans ?? fallback.fonts.sans,
          },
          radius: {
            default: activeCustom.advanced?.radius?.default ?? fallback.radius.default,
          },
        });
        applyCustomTheme(activeCustom);
      }
    } else {
      setThemeName(getThemeLabel(activeThemeId) || 'Preset Theme');
      setColors(readComputedThemeColors());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThemeId, customThemes]);

  // Sync custom theme name updates
  const handleThemeNameChange = (newName: string) => {
    setThemeName(newName);
    if (activeThemeId.startsWith('custom-')) {
      const activeCustom = customThemes.find((t: any) => t.id === activeThemeId);
      if (activeCustom) {
        const updated = { ...activeCustom, name: newName };
        saveCustomTheme(updated);
      }
    }
  };

  const applyCustomThemeStyles = (c: typeof colors, a: typeof advanced) => {
    applyCustomTheme({ colors: c, advanced: a });
  };

  // Convert current state into a new custom theme
  const ensureCustomThemeActive = (): string => {
    if (activeThemeId.startsWith('custom-')) {
      return activeThemeId;
    }
    const newId = 'custom-' + Date.now();
    const newCustom: CustomThemeProfile = {
      id: newId,
      name: `Custom Theme ${customThemes.length + 1}`,
      colors: { ...colors },
      advanced: { ...advanced }
    };

    saveCustomTheme(newCustom);
    setActiveThemeId(newId);
    setTheme(newId);
    return newId;
  };

  const onAddNewCustomTheme = () => {
    const newId = 'custom-' + Date.now();
    const newCustom: CustomThemeProfile = {
      id: newId,
      name: `Custom Theme ${customThemes.length + 1}`,
      colors: readComputedThemeColors(),
      advanced: readComputedAdvancedTokens(),
    };

    saveCustomTheme(newCustom);
    setActiveThemeId(newId);
    setTheme(newId);
    showToast('New custom theme created!', 'success');
  };

  const handlePickerChange = (key: string, val: string) => {
    const activeId = ensureCustomThemeActive();
    const updated = { ...colors, [key]: val };
    setColors(updated);

    // Update in list
    const activeCustom = customThemes.find((t: any) => t.id === activeId);
    if (activeCustom) {
      const updatedTheme = { ...activeCustom, colors: updated };
      saveCustomTheme(updatedTheme);
    }

    applyCustomThemeStyles(updated, advanced);
  };

  const handleHexInputChange = (key: string, val: string) => {
    let cleanVal = val;
    if (!cleanVal.startsWith('#')) cleanVal = '#' + cleanVal;
    
    setColors(prev => ({ ...prev, [key]: val }));

    if (/^#[0-9A-F]{6}$/i.test(cleanVal)) {
      const activeId = ensureCustomThemeActive();
      const updated = { ...colors, [key]: cleanVal };
      setColors(updated);

      const activeCustom = customThemes.find((t: any) => t.id === activeId);
      if (activeCustom) {
        const updatedTheme = { ...activeCustom, colors: updated };
        saveCustomTheme(updatedTheme);
      }

      applyCustomThemeStyles(updated, advanced);
    }
  };

  const handleAdvancedChange = (section: string, key: string, val: string) => {
    const activeId = ensureCustomThemeActive();
    const updatedAdvanced = {
      ...advanced,
      [section]: {
        ...(advanced as any)[section],
        [key]: val
      }
    };
    setAdvanced(updatedAdvanced);

    const activeCustom = customThemes.find((t: any) => t.id === activeId);
    if (activeCustom) {
      const updatedTheme = { ...activeCustom, advanced: updatedAdvanced };
      saveCustomTheme(updatedTheme);
    }

    applyCustomThemeStyles(colors, updatedAdvanced);
  };

  const onSelectPreset = (val: string) => {
    setActiveThemeId(val);
    setTheme(val);
    showToast(`Loaded theme preset.`, 'info');
  };

  const onResetTheme = () => {
    if (activeThemeId.startsWith('custom-')) {
      // Remove it from the list
      deleteCustomTheme(activeThemeId);
    }
    setActiveThemeId('default');
    setTheme('default');
    showToast('Theme customizer reset to default preset.', 'info');
  };

  const onDeleteCustomTheme = (id: string) => {
    deleteCustomTheme(id);
    
    if (activeThemeId === id) {
      setActiveThemeId('default');
      setTheme('default');
      
      document.documentElement.removeAttribute('style');
      setColors(readComputedThemeColors());
      setAdvanced(readComputedAdvancedTokens());
    }
    showToast('Theme deleted.', 'success');
  };

  const copyThemeJson = () => {
    const themeObj = {
      name: themeName,
      colors: {
        primary: colors.primary,
        bg: colors.bg,
        surface: colors.surface,
        border: colors.border,
        text: colors.text,
        'text-muted': colors['text-muted']
      },
      advanced: {
        shadows: advanced.shadows,
        fonts: advanced.fonts,
      }
    };
    const jsonStr = JSON.stringify(themeObj, null, 2);
    navigator.clipboard.writeText(jsonStr)
      .then(() => showToast('Theme configuration copied!', 'info'))
      .catch(() => showToast('Failed to copy JSON.', 'error'));
  };

  const unlockedThemeKeys = unlockedThemes.map(t => String(t));

  // Assemble preset theme items from engine previews + custom themes
  const presetThemes: PresetThemeInfo[] = [
    ...enginePresets.filter(t => unlockedThemeKeys.includes(t.value)).map(t => ({
      value: t.value,
      label: t.label,
      primary: t.primary,
      secondary: t.secondary,
      isActive: activeThemeId === t.value,
      isCustom: false
    })),
    ...customThemes.map(t => ({
      value: t.id,
      label: t.name,
      primary: t.colors.primary,
      secondary: t.colors.bg,
      isActive: activeThemeId === t.id,
      isCustom: true
    }))
  ];

  // Validate colors on the fly
  const invalidColorFields = Object.entries(colors).filter(([_, val]) => {
    let cleanVal = val || '';
    if (!cleanVal.startsWith('#')) cleanVal = '#' + cleanVal;
    return !/^#([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(cleanVal);
  }).map(([key]) => key);

  const hasColorError = invalidColorFields.length > 0;

  return (
    <ThemingTemplate
      themeName={themeName}
      setThemeName={handleThemeNameChange}
      isNameDisabled={!activeThemeId.startsWith('custom-')}
      colors={colors}
      advanced={advanced}
      handleHexInputChange={handleHexInputChange}
      handlePickerChange={handlePickerChange}
      handleAdvancedChange={handleAdvancedChange}
      presetThemes={presetThemes}
      onSelectPreset={onSelectPreset}
      onAddNewCustomTheme={onAddNewCustomTheme}
      jsonError={hasColorError}
      copyThemeJson={copyThemeJson}
      onResetTheme={onResetTheme}
      onDeleteCustomTheme={onDeleteCustomTheme}
      invalidColorFields={invalidColorFields}
      getInputWidth={getInputWidth}
    />
  );
};
export default Theming;
