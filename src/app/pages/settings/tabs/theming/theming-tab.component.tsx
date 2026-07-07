import React, { useState, useEffect } from 'react';
import { useTheme } from 'app/providers/theme-context';
import { ThemingTabTemplate } from './theming-tab.html';
import { PresetThemeInfo } from './interfaces/preset-theme-info.interface';
import { CustomThemeProfile } from './interfaces/custom-theme-profile.interface';
import { ThemingTabProps } from './interfaces/theming-tab-props.interface';
import { applyCustomTheme, clearCustomTheme } from 'core/theme/apply-custom-theme';
import { rgbToHex } from 'core/theme/color-conversion.util';
import { getInputWidth } from './utils/get-input-width.util';

export const ThemingTab: React.FC<ThemingTabProps> = ({ showToast }) => {
  const {
    theme: currentAppTheme,
    setTheme,
    unlockedThemes,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme
  } = useTheme();

  // Active Theme ID (preset theme key or custom theme ID)
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    const useCustom = localStorage.getItem('giftistry-use-custom-theme') === 'true';
    if (useCustom) {
      const savedTheme = localStorage.getItem('giftistry-custom-theme');
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (parsed.id) return parsed.id;
        } catch (e) {}
      }
    }
    return currentAppTheme;
  });

  const [themeName, setThemeName] = useState('Custom Theme');

  // Visual Colors State
  const [colors, setColors] = useState({
    primary: '#5e6ad2',
    bg: '#0f0f10',
    surface: '#151516',
    border: '#262629',
    text: '#f7f8f8',
    'text-muted': '#8a8f98',
  });

  // Advanced Tokens State
  const [advanced, setAdvanced] = useState({
    shadows: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    fonts: {
      sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    },
    radius: {
      default: "8px"
    }
  });

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
        setAdvanced(activeCustom.advanced);
        applyCustomTheme(activeCustom);
      }
    } else {
      // It is a preset theme
      const presets: Record<string, string> = {
        default: 'Linear',
        neon: 'Neon',
        cyberpunk: 'Cyberpunk',
        mystic: 'Mystic',
        'burnt-forest': 'Burnt Forest',
        paper: 'Paper',
        'paper-mario': 'Paper Mario',
        'retro-80s': "80's Retro",
        pixel: 'Pixel Art',
        matrix: 'Matrix',
        terminal: 'Terminal',
        vaporwave: 'Vaporwave',
        arcade: 'Arcade',
        valentines: "Valentine's",
        'st-patricks': "St. Patrick's",
        'earth-day': 'Earth Day',
        independence: 'Independence',
        halloween: 'Halloween',
        thanksgiving: 'Thanksgiving',
        christmas: 'Christmas',
      };
      setThemeName(presets[activeThemeId] || 'Preset Theme');

      // Extract colors from DOM computed variables
      const computed = getComputedStyle(document.documentElement);
      const themeColors = {
        primary: rgbToHex(computed.getPropertyValue('--primary').trim()) || '#5e6ad2',
        bg: rgbToHex(computed.getPropertyValue('--bg').trim()) || '#0f0f10',
        surface: rgbToHex(computed.getPropertyValue('--surface').trim()) || '#151516',
        border: rgbToHex(computed.getPropertyValue('--border').trim()) || '#262629',
        text: rgbToHex(computed.getPropertyValue('--text').trim()) || '#f7f8f8',
        'text-muted': rgbToHex(computed.getPropertyValue('--text-muted').trim()) || '#8a8f98',
      };
      setColors(themeColors);
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
        localStorage.setItem('giftistry-custom-theme', JSON.stringify(updated));
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
    const getCssColor = (name: string, fallback: string): string => {
      let val = window.getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
      if (!val) {
        val = window.getComputedStyle(document.documentElement).getPropertyValue(`--theme-${name}`).trim();
      }
      if (val && val.startsWith('rgb')) {
        const rgbValues = val.match(/\d+/g);
        if (rgbValues && rgbValues.length >= 3) {
          const r = parseInt(rgbValues[0]!, 10).toString(16).padStart(2, '0');
          const g = parseInt(rgbValues[1]!, 10).toString(16).padStart(2, '0');
          const b = parseInt(rgbValues[2]!, 10).toString(16).padStart(2, '0');
          return `#${r}${g}${b}`;
        }
      }
      return val && val.startsWith('#') ? val : fallback;
    };

    const newId = 'custom-' + Date.now();
    const newCustom: CustomThemeProfile = {
      id: newId,
      name: `Custom Theme ${customThemes.length + 1}`,
      colors: {
        primary: getCssColor('primary', '#5e6ad2'),
        bg: getCssColor('bg', '#0f0f10'),
        surface: getCssColor('surface', '#151516'),
        border: getCssColor('border', '#262629'),
        text: getCssColor('text', '#f7f8f8'),
        'text-muted': getCssColor('text-muted', '#8a8f98'),
      },
      advanced: {
        shadows: {
          sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        },
        fonts: {
          sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
        },
        radius: {
          default: "8px"
        }
      }
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
      localStorage.setItem('giftistry-custom-theme', JSON.stringify(updatedTheme));
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
        localStorage.setItem('giftistry-custom-theme', JSON.stringify(updatedTheme));
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
      localStorage.setItem('giftistry-custom-theme', JSON.stringify(updatedTheme));
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
    localStorage.setItem('giftistry-use-custom-theme', 'false');
    localStorage.removeItem('giftistry-custom-theme');
    setActiveThemeId('default');
    setTheme('default');
    showToast('Theme customizer reset to default preset.', 'info');
  };

  const onDeleteCustomTheme = (id: string) => {
    deleteCustomTheme(id);
    
    if (activeThemeId === id) {
      localStorage.setItem('giftistry-use-custom-theme', 'false');
      localStorage.removeItem('giftistry-custom-theme');
      setActiveThemeId('default');
      setTheme('default');
      
      const defaultPreset = coreThemes.find(t => t.value === 'default');
      if (defaultPreset) {
        setColors({
          primary: defaultPreset.primary,
          bg: '#0f0f10',
          surface: '#151516',
          border: '#262629',
          text: '#f7f8f8',
          'text-muted': '#8a8f98',
        });
        setAdvanced({
          shadows: {
            sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          },
          fonts: {
            sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
          },
          radius: {
            default: "8px"
          }
        });
        document.documentElement.removeAttribute('style');
      }
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

  // Core & Holiday lists
  const coreThemes = [
    { value: 'default', label: 'Linear', primary: '#5e6ad2', secondary: '#0f0f10' },
    { value: 'neon', label: 'Neon', primary: '#00ffcc', secondary: '#05050a' },
    { value: 'cyberpunk', label: 'Cyberpunk', primary: '#ff0055', secondary: '#1a0033' },
    { value: 'mystic', label: 'Mystic', primary: '#b829c2', secondary: '#0d0b14' },
    { value: 'burnt-forest', label: 'Burnt Forest', primary: '#e65c00', secondary: '#0f140f' },
    { value: 'paper', label: 'Paper', primary: '#4a5568', secondary: '#f5f0e6' },
    { value: 'paper-mario', label: 'Paper Mario', primary: '#e52521', secondary: '#87ceeb' },
    { value: 'retro-80s', label: "Retro", primary: '#ff6ec7', secondary: '#1a0a2e' },
    { value: 'pixel', label: 'Pixel Art', primary: '#e52521', secondary: '#1a1c2c' },
    { value: 'matrix', label: 'Matrix', primary: '#00ff41', secondary: '#0d0208' },
    { value: 'terminal', label: 'Terminal', primary: '#ffb000', secondary: '#0a0a0a' },
    { value: 'vaporwave', label: 'Vaporwave', primary: '#ff71ce', secondary: '#1a0033' },
    { value: 'arcade', label: 'Arcade', primary: '#ff0040', secondary: '#1a1a2e' },
  ];

  const holidayThemes = [
    { value: 'valentines', label: "Valentine's", primary: '#e11d48', secondary: '#fff5f5' },
    { value: 'st-patricks', label: "St. Patrick's", primary: '#15803d', secondary: '#f0fdf4' },
    { value: 'earth-day', label: 'Earth Day', primary: '#0d9488', secondary: '#f0fdfa' },
    { value: 'independence', label: 'Independence', primary: '#1d4ed8', secondary: '#f8fafc' },
    { value: 'halloween', label: 'Halloween', primary: '#ea580c', secondary: '#0c0a09' },
    { value: 'thanksgiving', label: 'Thanksgiving', primary: '#b45309', secondary: '#fdf8f2' },
    { value: 'christmas', label: 'Christmas', primary: '#b91c1c', secondary: '#f4fbf7' }
  ];

  const unlockedThemeKeys = unlockedThemes.map(t => String(t));

  // Assemble preset theme items
  const presetThemes: PresetThemeInfo[] = [
    ...coreThemes.filter(t => unlockedThemeKeys.includes(t.value)).map(t => ({
      value: t.value,
      label: t.label,
      primary: t.primary,
      secondary: t.secondary,
      isActive: activeThemeId === t.value,
      isCustom: false
    })),
    ...holidayThemes.filter(t => unlockedThemeKeys.includes(t.value)).map(t => ({
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
    <ThemingTabTemplate
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
export default ThemingTab;
