import React from 'react';
import { EnterPanel } from 'shared/ui';
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
  getInputWidth,
}) => {
  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      {/* Page Header */}
      <div className={styles['page-header']}>
        <div className={styles['header-info-group']}>
          <h2 className={styles['page-title']}>Workspace Customizer</h2>
          <p className={styles['page-subtitle']}>
            Personalize the color palette, fonts, shadows, and borders of your Giftistry experience.
          </p>
        </div>

        {/* Theme Name Box */}
        <div className={styles['name-field-wrapper']}>
          <label className={styles['mini-label']}>Theme Name</label>
          <input
            type="text"
            className={styles['theme-name-input']}
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            disabled={isNameDisabled}
            placeholder="Select a Preset"
          />
        </div>
      </div>

      {/* Preset Swatches & Custom Themes Theme Bar */}
      <div className={styles['theme-bar-section']}>
        <div className={styles['section-title']}>Themes & Presets</div>
        <div className={styles['theme-bar']}>
          {presetThemes.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`${styles['theme-bar-card']} ${t.isActive ? styles['active-card'] : ''} ${t.isCustom ? styles['custom-theme-card'] : ''}`}
              onClick={() => onSelectPreset(t.value)}
            >
              {t.isCustom && (
                <button
                  type="button"
                  className={styles['delete-card-btn']}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomTheme(t.value);
                  }}
                  title="Delete custom theme"
                >
                  <X size={10} />
                </button>
              )}
              <div className={styles['swatch-box']}>
                <div className={styles['primary-swatch']} style={{ backgroundColor: t.primary }} />
                <div className={styles['secondary-swatch']} style={{ backgroundColor: t.secondary }} />
              </div>
              <span className={styles['card-label']}>{t.label}</span>
            </button>
          ))}
          
          {/* New Custom Theme Square Button */}
          <button
            type="button"
            className={`${styles['theme-bar-card']} ${styles['new-theme-card']}`}
            onClick={onAddNewCustomTheme}
            title="Create new custom theme profile"
          >
            <div className={styles['plus-box']}>
              <span>+</span>
            </div>
            <span className={styles['card-label']}>New Theme</span>
          </button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className={styles['theming-grid']}>
        {/* Visual Swatches Panel */}
        <div className={styles['glass-card']}>
          <h3 className={styles['card-header-title']}>Visual Swatches</h3>
          <p className={styles['card-header-subtitle']}>Fine-tune your palette hex codes or pick custom colors.</p>
          
          <div className={styles['theme-group']}>
            <div className={styles['theme-group-title']}>Brand Accent</div>
            <div className={styles['theme-row']}>
              <span className={styles['input-label']}>Primary Action / Highlight</span>
              <div className={styles['color-control']}>
                <input
                  type="text"
                  className={`${styles['hex-input']} ${invalidColorFields.includes('primary') ? styles['invalid-input'] : ''}`}
                  value={colors.primary.toUpperCase()}
                  onChange={(e) => handleHexInputChange('primary', e.target.value)}
                  disabled={isNameDisabled}
                />
                <div className={styles['custom-picker-wrapper']}>
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => handlePickerChange('primary', e.target.value)}
                    disabled={isNameDisabled}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles['theme-group']}>
            <div className={styles['theme-group-title']}>Background Tones</div>
            <div className={styles['theme-row']}>
              <span className={styles['input-label']}>Base Background</span>
              <div className={styles['color-control']}>
                <input
                  type="text"
                  className={`${styles['hex-input']} ${invalidColorFields.includes('bg') ? styles['invalid-input'] : ''}`}
                  value={colors.bg.toUpperCase()}
                  onChange={(e) => handleHexInputChange('bg', e.target.value)}
                  disabled={isNameDisabled}
                />
                <div className={styles['custom-picker-wrapper']}>
                  <input
                    type="color"
                    value={colors.bg}
                    onChange={(e) => handlePickerChange('bg', e.target.value)}
                    disabled={isNameDisabled}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles['theme-row']}>
              <span className={styles['input-label']}>Surface (Navbar/Cards)</span>
              <div className={styles['color-control']}>
                <input
                  type="text"
                  className={`${styles['hex-input']} ${invalidColorFields.includes('surface') ? styles['invalid-input'] : ''}`}
                  value={colors.surface.toUpperCase()}
                  onChange={(e) => handleHexInputChange('surface', e.target.value)}
                  disabled={isNameDisabled}
                />
                <div className={styles['custom-picker-wrapper']}>
                  <input
                    type="color"
                    value={colors.surface}
                    onChange={(e) => handlePickerChange('surface', e.target.value)}
                    disabled={isNameDisabled}
                  />
                </div>
              </div>
            </div>

            <div className={styles['theme-row']}>
              <span className={styles['input-label']}>Border Lines & Dividers</span>
              <div className={styles['color-control']}>
                <input
                  type="text"
                  className={`${styles['hex-input']} ${invalidColorFields.includes('border') ? styles['invalid-input'] : ''}`}
                  value={colors.border.toUpperCase()}
                  onChange={(e) => handleHexInputChange('border', e.target.value)}
                  disabled={isNameDisabled}
                />
                <div className={styles['custom-picker-wrapper']}>
                  <input
                    type="color"
                    value={colors.border}
                    onChange={(e) => handlePickerChange('border', e.target.value)}
                    disabled={isNameDisabled}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles['theme-group']} style={{ marginBottom: 0 }}>
            <div className={styles['theme-group-title']}>Typography Color Tokens</div>
            <div className={styles['theme-row']}>
              <span className={styles['input-label']}>Primary Font</span>
              <div className={styles['color-control']}>
                <input
                  type="text"
                  className={`${styles['hex-input']} ${invalidColorFields.includes('text') ? styles['invalid-input'] : ''}`}
                  value={colors.text.toUpperCase()}
                  onChange={(e) => handleHexInputChange('text', e.target.value)}
                  disabled={isNameDisabled}
                />
                <div className={styles['custom-picker-wrapper']}>
                  <input
                    type="color"
                    value={colors.text}
                    onChange={(e) => handlePickerChange('text', e.target.value)}
                    disabled={isNameDisabled}
                  />
                </div>
              </div>
            </div>

            <div className={styles['theme-row']}>
              <span className={styles['input-label']}>Muted Secondary Font</span>
              <div className={styles['color-control']}>
                <input
                  type="text"
                  className={`${styles['hex-input']} ${invalidColorFields.includes('text-muted') ? styles['invalid-input'] : ''}`}
                  value={colors['text-muted'].toUpperCase()}
                  onChange={(e) => handleHexInputChange('text-muted', e.target.value)}
                  disabled={isNameDisabled}
                />
                <div className={styles['custom-picker-wrapper']}>
                  <input
                    type="color"
                    value={colors['text-muted']}
                    onChange={(e) => handlePickerChange('text-muted', e.target.value)}
                    disabled={isNameDisabled}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pseudo JSON Editor Panel */}
        <div className={styles['code-snippet-container']}>
          <div className={styles['code-snippet-header']}>
            <span className={styles['code-snippet-title']}>Config</span>
            <div className={styles['code-snippet-actions']}>
              <button
                onClick={onResetTheme}
                className={styles['icon-btn']}
                title="Reset theme config"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={copyThemeJson}
                className={styles['icon-btn']}
                title="Copy theme JSON"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className={styles['pseudo-json-editor']}>
            <div className={styles['json-line']}><span className={styles['json-punct']}>{"{"}</span></div>
            <div className={`${styles['json-line']} ${styles.indent1}`}>
              <span className={styles['json-key']}>{"\"name\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={styles['json-inline-input']}
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(themeName), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent1}`}>
              <span className={styles['json-key']}>{"\"colors\""}</span>
              <span className={styles['json-punct']}>{"\": {"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"primary\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles['json-inline-input']} ${invalidColorFields.includes('primary') ? styles['invalid-json-input'] : ''}`}
                value={colors.primary}
                onChange={(e) => handleHexInputChange('primary', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(colors.primary), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"bg\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles['json-inline-input']} ${invalidColorFields.includes('bg') ? styles['invalid-json-input'] : ''}`}
                value={colors.bg}
                onChange={(e) => handleHexInputChange('bg', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(colors.bg), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"surface\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles['json-inline-input']} ${invalidColorFields.includes('surface') ? styles['invalid-json-input'] : ''}`}
                value={colors.surface}
                onChange={(e) => handleHexInputChange('surface', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(colors.surface), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"border\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles['json-inline-input']} ${invalidColorFields.includes('border') ? styles['invalid-json-input'] : ''}`}
                value={colors.border}
                onChange={(e) => handleHexInputChange('border', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(colors.border), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"text\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles['json-inline-input']} ${invalidColorFields.includes('text') ? styles['invalid-json-input'] : ''}`}
                value={colors.text}
                onChange={(e) => handleHexInputChange('text', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(colors.text), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"text-muted\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={`${styles['json-inline-input']} ${invalidColorFields.includes('text-muted') ? styles['invalid-json-input'] : ''}`}
                value={colors['text-muted']}
                onChange={(e) => handleHexInputChange('text-muted', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(colors['text-muted']), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\""}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent1}`}>
              <span className={styles['json-punct']}>{"},"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent1}`}>
              <span className={styles['json-key']}>{"\"advanced\""}</span>
              <span className={styles['json-punct']}>{"\": {"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"shadows\""}</span>
              <span className={styles['json-punct']}>{"\": {"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent3}`}>
              <span className={styles['json-key']}>{"\"sm\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={styles['json-inline-input']}
                value={advanced.shadows.sm}
                onChange={(e) => handleAdvancedChange('shadows', 'sm', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(advanced.shadows.sm), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent3}`}>
              <span className={styles['json-key']}>{"\"md\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={styles['json-inline-input']}
                value={advanced.shadows.md}
                onChange={(e) => handleAdvancedChange('shadows', 'md', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(advanced.shadows.md), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\","}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent3}`}>
              <span className={styles['json-key']}>{"\"lg\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={styles['json-inline-input']}
                value={advanced.shadows.lg}
                onChange={(e) => handleAdvancedChange('shadows', 'lg', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(advanced.shadows.lg), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\""}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-punct']}>{"},"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-key']}>{"\"fonts\""}</span>
              <span className={styles['json-punct']}>{"\": {"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent3}`}>
              <span className={styles['json-key']}>{"\"sans\""}</span>
              <span className={styles['json-punct']}>{"\": \""}</span>
              <input
                type="text"
                className={styles['json-inline-input']}
                value={advanced.fonts.sans}
                onChange={(e) => handleAdvancedChange('fonts', 'sans', e.target.value)}
                disabled={isNameDisabled}
                style={{ width: getInputWidth(advanced.fonts.sans), maxWidth: '100%' }}
              />
              <span className={styles['json-punct']}>{"\""}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent2}`}>
              <span className={styles['json-punct']}>{"}"}</span>
            </div>
            
            <div className={`${styles['json-line']} ${styles.indent1}`}>
              <span className={styles['json-punct']}>{"}"}</span>
            </div>
            
            <div className={styles['json-line']}>
              <span className={styles['json-punct']}>{"}"}</span>
            </div>
          </div>
          {jsonError && (
            <p className={styles['json-error-message']}>Invalid theme format: please check highlighted color values.</p>
          )}
        </div>
      </div>
    </EnterPanel>
  );
};
export default ThemingTabTemplate;
