import React from 'react';
import { Copy, RotateCcw, X } from 'lucide-react';
import { ThemingTabTemplateProps } from './interfaces/theming-tab-template-props.interface';
import styles from './theming-tab.module.css';

export const ThemingTabTemplate: React.FC<ThemingTabTemplateProps> = ({
  themeName,
  setThemeName,
  isNameDisabled,
  colors,
  advanced,
  handleHexInputChange,
  handlePickerChange,
  handleAdvancedChange,
  presetThemes,
  onSelectPreset,
  onAddNewCustomTheme,
  jsonError,
  copyThemeJson,
  onResetTheme,
  onDeleteCustomTheme,
  invalidColorFields,
}) => {
  // Helper to dynamically calculate width of input based on its text content
  const getInputWidth = (val: string) => {
    const stringVal = val || '';
    const charWidth = 7.8; // monospace font character width at 0.8125rem
    const minWidth = 12;   // minimum width to allow typing
    return `${Math.max(stringVal.length * charWidth + 10, minWidth)}px`;
  };

  // Helper to automatically adjust textarea height based on its content
  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  return (
    <div className={styles.tabPane}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfoGroup}>
          <h2 className={styles.pageTitle}>Workspace Customizer</h2>
          <p className={styles.pageSubtitle}>
            Personalize the color palette, fonts, shadows, and borders of your Giftistry experience.
          </p>
        </div>

        {/* Theme Name Box */}
        <div className={styles.nameFieldWrapper}>
          <label className={styles.miniLabel}>Theme Name</label>
          <input
            type="text"
            className={styles.themeNameInput}
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            disabled={isNameDisabled}
            placeholder="Select a Preset"
          />
        </div>
      </div>

      {/* Preset Swatches & Custom Themes Theme Bar */}
      <div className={styles.themeBarSection}>
        <div className={styles.sectionTitle}>Themes & Presets</div>
        <div className={styles.themeBar}>
          {presetThemes.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`${styles.themeBarCard} ${t.isActive ? styles.activeCard : ''} ${t.isCustom ? styles.customThemeCard : ''}`}
              onClick={() => onSelectPreset(t.value)}
            >
              {t.isCustom && (
                <button
                  type="button"
                  className={styles.deleteCardBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomTheme(t.value);
                  }}
                  title="Delete custom theme"
                >
                  <X size={10} />
                </button>
              )}
              <div className={styles.swatchBox}>
                <div className={styles.primarySwatch} style={{ backgroundColor: t.primary }} />
                <div className={styles.secondarySwatch} style={{ backgroundColor: t.secondary }} />
              </div>
              <span className={styles.cardLabel}>{t.label}</span>
            </button>
          ))}
          
          {/* New Custom Theme Square Button */}
          <button
            type="button"
            className={`${styles.themeBarCard} ${styles.newThemeCard}`}
            onClick={onAddNewCustomTheme}
            title="Create new custom theme profile"
          >
            <div className={styles.plusBox}>
              <span>+</span>
            </div>
            <span className={styles.cardLabel}>New Theme</span>
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className={styles.themingGrid}>
        {/* Visual Swatches Panel */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardHeaderTitle}>Visual Swatches</h3>
          <p className={styles.cardHeaderSubtitle}>Fine-tune your palette hex codes or pick custom colors.</p>
          
          <div className={styles.themeGroup}>
            <div className={styles.themeGroupTitle}>Brand Accent</div>
            <div className={styles.themeRow}>
              <span className={styles.inputLabel}>Primary Action / Highlight</span>
              <div className={styles.colorControl}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${invalidColorFields.includes('primary') ? styles.invalidInput : ''}`}
                  value={colors.primary.toUpperCase()}
                  onChange={(e) => handleHexInputChange('primary', e.target.value)}
                />
                <div className={styles.customPickerWrapper}>
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => handlePickerChange('primary', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.themeGroup}>
            <div className={styles.themeGroupTitle}>Background Tones</div>
            <div className={styles.themeRow}>
              <span className={styles.inputLabel}>Base Background</span>
              <div className={styles.colorControl}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${invalidColorFields.includes('bg') ? styles.invalidInput : ''}`}
                  value={colors.bg.toUpperCase()}
                  onChange={(e) => handleHexInputChange('bg', e.target.value)}
                />
                <div className={styles.customPickerWrapper}>
                  <input
                    type="color"
                    value={colors.bg}
                    onChange={(e) => handlePickerChange('bg', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.themeRow}>
              <span className={styles.inputLabel}>Surface (Navbar/Cards)</span>
              <div className={styles.colorControl}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${invalidColorFields.includes('surface') ? styles.invalidInput : ''}`}
                  value={colors.surface.toUpperCase()}
                  onChange={(e) => handleHexInputChange('surface', e.target.value)}
                />
                <div className={styles.customPickerWrapper}>
                  <input
                    type="color"
                    value={colors.surface}
                    onChange={(e) => handlePickerChange('surface', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.themeRow}>
              <span className={styles.inputLabel}>Border Lines & Dividers</span>
              <div className={styles.colorControl}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${invalidColorFields.includes('border') ? styles.invalidInput : ''}`}
                  value={colors.border.toUpperCase()}
                  onChange={(e) => handleHexInputChange('border', e.target.value)}
                />
                <div className={styles.customPickerWrapper}>
                  <input
                    type="color"
                    value={colors.border}
                    onChange={(e) => handlePickerChange('border', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.themeGroup} style={{ marginBottom: 0 }}>
            <div className={styles.themeGroupTitle}>Typography Color Tokens</div>
            <div className={styles.themeRow}>
              <span className={styles.inputLabel}>Primary Font</span>
              <div className={styles.colorControl}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${invalidColorFields.includes('text') ? styles.invalidInput : ''}`}
                  value={colors.text.toUpperCase()}
                  onChange={(e) => handleHexInputChange('text', e.target.value)}
                />
                <div className={styles.customPickerWrapper}>
                  <input
                    type="color"
                    value={colors.text}
                    onChange={(e) => handlePickerChange('text', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.themeRow}>
              <span className={styles.inputLabel}>Muted Secondary Font</span>
              <div className={styles.colorControl}>
                <input
                  type="text"
                  className={`${styles.hexInput} ${invalidColorFields.includes('text-muted') ? styles.invalidInput : ''}`}
                  value={colors['text-muted'].toUpperCase()}
                  onChange={(e) => handleHexInputChange('text-muted', e.target.value)}
                />
                <div className={styles.customPickerWrapper}>
                  <input
                    type="color"
                    value={colors['text-muted']}
                    onChange={(e) => handlePickerChange('text-muted', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pseudo JSON Editor Panel */}
        <div className={styles.codeSnippetContainer}>
          <div className={styles.codeSnippetHeader}>
            <span className={styles.codeSnippetTitle}>Config</span>
            <div className={styles.codeSnippetActions}>
              <button
                onClick={onResetTheme}
                className={styles.iconBtn}
                title="Reset theme config"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={copyThemeJson}
                className={styles.iconBtn}
                title="Copy theme JSON"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className={styles.pseudoJsonEditor}>
            <div className={styles.jsonLine}><span className={styles.jsonPunct}>{"{"}</span></div>
            <div className={`${styles.jsonLine} ${styles.indent1}`}>
              <span className={styles.jsonKey}>{"\"name\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={styles.jsonInlineInput}
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(themeName), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent1}`}>
              <span className={styles.jsonKey}>{"\"colors\""}</span>
              <span className={styles.jsonPunct}>{"\": {"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"primary\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles.jsonInlineInput} ${invalidColorFields.includes('primary') ? styles.invalidJsonInput : ''}`}
                value={colors.primary}
                onChange={(e) => handleHexInputChange('primary', e.target.value)}
                style={{ width: getInputWidth(colors.primary), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"bg\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles.jsonInlineInput} ${invalidColorFields.includes('bg') ? styles.invalidJsonInput : ''}`}
                value={colors.bg}
                onChange={(e) => handleHexInputChange('bg', e.target.value)}
                style={{ width: getInputWidth(colors.bg), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"surface\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles.jsonInlineInput} ${invalidColorFields.includes('surface') ? styles.invalidJsonInput : ''}`}
                value={colors.surface}
                onChange={(e) => handleHexInputChange('surface', e.target.value)}
                style={{ width: getInputWidth(colors.surface), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"border\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles.jsonInlineInput} ${invalidColorFields.includes('border') ? styles.invalidJsonInput : ''}`}
                value={colors.border}
                onChange={(e) => handleHexInputChange('border', e.target.value)}
                style={{ width: getInputWidth(colors.border), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"text\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles.jsonInlineInput} ${invalidColorFields.includes('text') ? styles.invalidJsonInput : ''}`}
                value={colors.text}
                onChange={(e) => handleHexInputChange('text', e.target.value)}
                style={{ width: getInputWidth(colors.text), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"text-muted\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles.jsonInlineInput} ${invalidColorFields.includes('text-muted') ? styles.invalidJsonInput : ''}`}
                value={colors['text-muted']}
                onChange={(e) => handleHexInputChange('text-muted', e.target.value)}
                style={{ width: getInputWidth(colors['text-muted']), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\""}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent1}`}>
              <span className={styles.jsonPunct}>{"},"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent1}`}>
              <span className={styles.jsonKey}>{"\"advanced\""}</span>
              <span className={styles.jsonPunct}>{"\": {"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"shadows\""}</span>
              <span className={styles.jsonPunct}>{"\": {"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent3}`}>
              <span className={styles.jsonKey}>{"\"sm\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <textarea
                ref={adjustHeight}
                className={styles.jsonInlineTextarea}
                value={advanced.shadows.sm}
                onChange={(e) => {
                  handleAdvancedChange('shadows', 'sm', e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent3}`}>
              <span className={styles.jsonKey}>{"\"md\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <textarea
                ref={adjustHeight}
                className={styles.jsonInlineTextarea}
                value={advanced.shadows.md}
                onChange={(e) => {
                  handleAdvancedChange('shadows', 'md', e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
              />
              <span className={styles.jsonPunct}>{"\","}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent3}`}>
              <span className={styles.jsonKey}>{"\"lg\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <textarea
                ref={adjustHeight}
                className={styles.jsonInlineTextarea}
                value={advanced.shadows.lg}
                onChange={(e) => {
                  handleAdvancedChange('shadows', 'lg', e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
              />
              <span className={styles.jsonPunct}>{"\""}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonPunct}>{"},"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"fonts\""}</span>
              <span className={styles.jsonPunct}>{"\": {"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent3}`}>
              <span className={styles.jsonKey}>{"\"sans\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <textarea
                ref={adjustHeight}
                className={styles.jsonInlineTextarea}
                value={advanced.fonts.sans}
                onChange={(e) => {
                  handleAdvancedChange('fonts', 'sans', e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
              />
              <span className={styles.jsonPunct}>{"\""}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonPunct}>{"},"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonKey}>{"\"radius\""}</span>
              <span className={styles.jsonPunct}>{"\": {"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent3}`}>
              <span className={styles.jsonKey}>{"\"default\""}</span>
              <span className={styles.jsonPunct}>{"\": \""}</span>
              <input
                type="text"
                className={styles.jsonInlineInput}
                value={advanced.radius.default}
                onChange={(e) => handleAdvancedChange('radius', 'default', e.target.value)}
                style={{ width: getInputWidth(advanced.radius.default), maxWidth: '100%' }}
              />
              <span className={styles.jsonPunct}>{"\""}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent2}`}>
              <span className={styles.jsonPunct}>{"}"}</span>
            </div>
            
            <div className={`${styles.jsonLine} ${styles.indent1}`}>
              <span className={styles.jsonPunct}>{"}"}</span>
            </div>
            
            <div className={styles.jsonLine}>
              <span className={styles.jsonPunct}>{"}"}</span>
            </div>
          </div>
          {jsonError && (
            <p className={styles.jsonErrorMessage}>Invalid theme format: please check highlighted color values.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ThemingTabTemplate;
