import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProfileThemingTemplateProps } from './interfaces/profile-theming-template-props.interface';
import styles from './profile-theming.module.css';

export const ProfileThemingTemplate: React.FC<ProfileThemingTemplateProps> = ({
  theme,
  appearance,
  setTheme,
  setAppearance,
  tabIndex,
  appearances,
  unlockedSwatches,
  visibleSwatches,
  swatchOffset,
  maxSwatchOffset,
  onPreviousSwatches,
  onNextSwatches,
}) => (
  <div className={styles['profile-theming']}>
    <div
      className={styles['segmented-control']}
      data-state={appearance}
    >
      <div className={styles['segmented-indicator']} />
      {appearances.map((a) => {
        const Icon = a.icon;
        const active = appearance === a.value;
        return (
          <button
            key={a.value}
            type="button"
            tabIndex={tabIndex}
            className={`${styles['segmented-btn']} ${active ? styles['is-active'] : ''}`}
            onClick={() => setAppearance(a.value)}
          >
            <Icon size={14} />
            <span>{a.label}</span>
          </button>
        );
      })}
    </div>

    {unlockedSwatches.length > 0 && (
      <div className={styles['theme-swatch-bar']}>
        <button
          type="button"
          className={styles['theme-swatch-nav']}
          tabIndex={tabIndex}
          aria-label="Previous themes"
          disabled={swatchOffset <= 0}
          onClick={onPreviousSwatches}
        >
          <ChevronLeft size={16} />
        </button>

        <div className={styles['theme-swatches']}>
          {visibleSwatches.map((swatch) => {
            const active = theme === swatch.value;

            return (
              <button
                key={swatch.value}
                type="button"
                tabIndex={tabIndex}
                className={`${styles['theme-swatch']} ${active ? styles['is-active'] : ''}`}
                style={
                  {
                    '--swatch-primary': swatch.primary,
                    '--swatch-secondary': swatch.secondary,
                  } as React.CSSProperties
                }
                onClick={() => setTheme(swatch.value)}
                title={swatch.label}
              >
                <span className={styles['theme-swatch-primary']} aria-hidden />
                <span className={styles['theme-swatch-secondary']} aria-hidden />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={styles['theme-swatch-nav']}
          tabIndex={tabIndex}
          aria-label="Next themes"
          disabled={swatchOffset >= maxSwatchOffset}
          onClick={onNextSwatches}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    )}
  </div>
);
