import React from 'react';
import { ChevronDown, Lock, Moon, Palette, Sun } from 'lucide-react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import type { ThemeMenuTemplateProps } from './interfaces/theme-menu-template-props.interface';
import styles from './theme-menu.module.css';

export const ThemeMenuTemplate: React.FC<ThemeMenuTemplateProps> = ({
  themeRef,
  isThemeOpen,
  onToggleTheme,
  appearance,
  standardThemes,
  showHolidaySection,
  isHolidayOpen,
  onToggleHoliday,
  holidayThemes,
  customThemes,
  temporaryTheme,
  appearances,
}) => (
  <div
    className={`${styles['dropdown-container']} ${styles['theme-selector']}`}
    ref={themeRef}
  >
    <button
      className={`${styles['nav-button']} ${styles['theme-nav-button']}`}
      onClick={onToggleTheme}
      aria-label="Theme settings"
      title="Change theme"
      type="button"
    >
      <div className={styles['theme-toggle-wrapper']}>
        <Palette size={18} className={styles['palette-icon']} />
        <div className={styles['mini-indicator']}>
          {appearance === 'light' ? <Sun size={10} /> : <Moon size={10} />}
        </div>
      </div>
    </button>

    {isThemeOpen && (
      <EnterPanel animation="dropdown" className={`${styles['dropdown-menu']} ${styles['theme-menu']}`}>
        <div className={styles['menu-header']}>Style Theme</div>
        {standardThemes.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`${styles['menu-item']} ${t.isActive ? styles['active-item'] : ''} ${!t.unlocked ? styles['locked-item'] : ''}`}
            onClick={t.onSelect}
            disabled={!t.unlocked}
          >
            <span>{t.label}</span>
            {!t.unlocked && <Lock size={12} className={styles['lock-icon']} />}
          </button>
        ))}

        {showHolidaySection && (
          <>
            <button
              type="button"
              className={`${styles['menu-item']} ${styles['holiday-toggle']}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleHoliday();
              }}
            >
              <span>Holiday</span>
              <ChevronDown
                size={12}
                className={`${styles.chevron} ${isHolidayOpen ? styles['rotated-chevron'] : ''}`}
              />
            </button>

            {isHolidayOpen && (
              <div className={styles['holiday-sub-menu']}>
                {holidayThemes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`${styles['menu-item']} ${styles['holiday-menu-item']} ${t.isActive ? styles['active-item'] : ''}`}
                    onClick={t.onSelect}
                  >
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {customThemes.length > 0 && (
          <>
            <div className={styles['menu-divider']} />
            <div className={styles['menu-header']}>Custom Themes</div>
            {customThemes.map((ct) => (
              <button
                key={ct.id}
                type="button"
                className={`${styles['menu-item']} ${ct.isActive ? styles['active-item'] : ''}`}
                onClick={ct.onSelect}
              >
                <span>{ct.name}</span>
              </button>
            ))}
          </>
        )}

        {temporaryTheme && (
          <>
            <div className={styles['menu-divider']} />
            <div className={styles['menu-header']}>Tried Theme</div>
            <button
              type="button"
              className={`${styles['menu-item']} ${temporaryTheme.isActive ? styles['active-item'] : ''}`}
              onClick={temporaryTheme.onSelect}
            >
              <span>{temporaryTheme.label}</span>
            </button>
          </>
        )}

        <div className={styles['menu-divider']} />

        <div className={styles['menu-header']}>Appearance</div>
        {appearances.map((a) => (
          <button
            key={a.value}
            type="button"
            className={`${styles['menu-item']} ${a.isActive ? styles['active-item'] : ''}`}
            onClick={a.onSelect}
          >
            {a.icon}
            {a.label}
          </button>
        ))}
      </EnterPanel>
    )}
  </div>
);
