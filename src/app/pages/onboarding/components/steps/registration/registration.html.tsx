import React from 'react';
import { Badge } from 'shared/ui';
import { REGISTRATION_OPTIONS } from '../../../constants/registration-options.constant';
import { GlowCard } from '../../glow-card/glow-card.component';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { RegistrationTemplateProps } from './interfaces/registration-template-props.interface';
import styles from './registration.module.css';

export const RegistrationTemplate: React.FC<RegistrationTemplateProps> = ({
  registrationMode,
  onSelect,
  onGlowMove,
}) => (
  <div className={styles['registration']}>
    {REGISTRATION_OPTIONS.map((option) => {
      const selected = registrationMode === option.value;
      return (
        <StaggerItem key={option.value}>
          <label className={styles['registration__card']}>
            <input
              type="radio"
              name="registrationMode"
              value={option.value}
              checked={selected}
              onChange={() => onSelect(option.value)}
              className={styles['registration__input']}
            />
            <GlowCard as="div" selected={selected} onMouseMove={onGlowMove}>
              <div className={styles['registration__inner']}>
                <div
                  className={[
                    styles['registration__dot-wrap'],
                    selected ? styles['registration__dot-wrap--selected'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div
                    className={[
                      styles['registration__dot'],
                      selected ? styles['registration__dot--selected'] : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  />
                </div>
                <div>
                  <div className={styles['registration__title-row']}>
                    <span className={styles['registration__title']}>{option.title}</span>
                    {option.defaultBadge ? (
                      <Badge size="sm" active>
                        Default
                      </Badge>
                    ) : null}
                  </div>
                  <div className={styles['registration__desc']}>{option.desc}</div>
                </div>
              </div>
            </GlowCard>
          </label>
        </StaggerItem>
      );
    })}
  </div>
);
