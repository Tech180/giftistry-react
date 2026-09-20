import React from 'react';
import { ArrowRight, ArrowLeft, Zap } from 'lucide-react';
import styles from './footer.module.css';
import type { FooterTemplateProps } from './interfaces/template-props.interface';

export const FooterTemplate: React.FC<FooterTemplateProps> = ({
  step,
  showFooterBack,
  showFooter,
  isSubmitting,
  onNext,
  onPrev,
  onFinish,
}) => {
  if (!showFooter) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <button
        type="button"
        className={`${styles['footer__btn-back']} ${
          showFooterBack ? '' : styles['footer__btn-back--hidden']
        }`}
        onClick={onPrev}
        disabled={!showFooterBack}
        tabIndex={showFooterBack ? 0 : -1}
      >
        <ArrowLeft size={16} aria-hidden />
        Back
      </button>

      {step === 4 ? (
        <button type="button" className={styles['footer__btn-primary']} onClick={onFinish}>
          Go to Login
          <ArrowRight size={16} aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          className={styles['footer__btn-continue']}
          onClick={onNext}
          disabled={isSubmitting}
        >
          {step === 2 ? (
            <>
              Initialize System
              <Zap size={16} aria-hidden />
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={16} aria-hidden />
            </>
          )}
        </button>
      )}
    </footer>
  );
};
