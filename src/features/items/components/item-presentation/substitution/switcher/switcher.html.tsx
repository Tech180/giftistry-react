import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './switcher.module.css';

export const SwitcherTemplate: React.FC<TemplateProps> = ({
  canPrev,
  canNext,
  onPrev,
  onNext,
  content,
  animationKey,
  rootClassName,
  panelClassName,
  prevNavClassName,
  nextNavClassName,
  ariaLabel,
}) => {
  return (
    <div className={rootClassName} aria-label={ariaLabel}>
      {canPrev ? (
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous option"
          className={prevNavClassName}
        >
          <span className={styles['switcher__nav-icon']}>
            <ChevronLeft size={20} strokeWidth={2.5} />
          </span>
        </button>
      ) : null}

      <div className={styles['switcher__content']}>
        <div key={animationKey} className={panelClassName}>
          {content}
        </div>
      </div>

      {canNext ? (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next option"
          className={nextNavClassName}
        >
          <span className={styles['switcher__nav-icon']}>
            <ChevronRight size={20} strokeWidth={2.5} />
          </span>
        </button>
      ) : null}
    </div>
  );
};
