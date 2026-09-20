import React from 'react';
import { Check } from 'lucide-react';
import { GlowCard } from '../../glow-card/glow-card.component';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { ThemeTemplateProps } from './interfaces/theme-template-props.interface';
import styles from './theme.module.css';

export const ThemeTemplate: React.FC<ThemeTemplateProps> = ({
  theme,
  themeOptions,
  onSelect,
  onGlowMove,
}) => (
  <div className={styles['theme']}>
    {themeOptions.map((option) => {
      const selected = theme === option.id;
      return (
        <StaggerItem key={option.id}>
          <GlowCard
            selected={selected}
            onClick={() => onSelect(option.id)}
            onMouseMove={onGlowMove}
          >
            <div
              className={styles['theme__preview']}
              style={{ background: option.previewBg }}
            >
              <div className={styles['theme__preview-bar']}>
                <div className={styles['theme__preview-chip']} />
                <div
                  className={styles['theme__preview-dot']}
                  style={{ background: option.previewAccent }}
                />
              </div>
              <div
                className={`${styles['theme__preview-line']} ${styles['theme__preview-line--md']}`}
              />
              <div
                className={`${styles['theme__preview-line']} ${styles['theme__preview-line--sm']}`}
              />
            </div>
            <div className={styles['theme__meta']}>
              <span className={styles['theme__label']}>{option.label}</span>
              <span
                className={[
                  styles['theme__check'],
                  selected ? styles['theme__check--on'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Check size={10} strokeWidth={3} />
              </span>
            </div>
          </GlowCard>
        </StaggerItem>
      );
    })}
  </div>
);
