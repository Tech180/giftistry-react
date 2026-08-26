import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SUBSTITUTION_SWITCH_LABEL } from '../../../../constants/substitution-messages.constant';
import type { SubstitutionSwitcherTemplateProps } from './interfaces/substitution-switcher-template-props.interface';
import styles from './switcher.module.css';

export const SubstitutionSwitcherTemplate: React.FC<SubstitutionSwitcherTemplateProps> = ({
  browse,
  canPrev,
  canNext,
  onPrev,
  onNext,
  direction = 'none',
  content,
  animationKey,
  className = '',
}) => {
  const showControls = browse.length > 1;

  const panelAnimClass =
    direction === 'forward'
      ? styles['panel-slide-forward']
      : direction === 'backward'
        ? styles['panel-slide-backward']
        : styles['panel-fade'];

  return (
    <div
      className={[styles.switcher, className].filter(Boolean).join(' ')}
      aria-label={showControls ? SUBSTITUTION_SWITCH_LABEL : undefined}
    >
      {canPrev ? (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous option"
          className={`${styles['nav-edge']} ${styles['nav-edge-prev']}`}
        >
          <span className={styles['nav-icon-wrapper']}>
            <ChevronLeft size={20} strokeWidth={2.5} />
          </span>
        </button>
      ) : null}

      <div className={styles.content}>
        <div key={animationKey} className={`${styles.panel} ${panelAnimClass}`}>
          {content}
        </div>
      </div>

      {canNext ? (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next option"
          className={`${styles['nav-edge']} ${styles['nav-edge-next']}`}
        >
          <span className={styles['nav-icon-wrapper']}>
            <ChevronRight size={20} strokeWidth={2.5} />
          </span>
        </button>
      ) : null}
    </div>
  );
};
