import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from 'shared/ui';
import type { FooterTemplateProps } from './interfaces/footer-template-props.interface';
import styles from './footer.module.css';

export const FooterTemplate: React.FC<FooterTemplateProps> = ({
  step,
  stepId,
  panelPhase,
  isSubmitting,
  canSkip,
  primaryCtaLabel,
  onBack,
  onSkip,
  onNext,
}) => {
  const disabled = isSubmitting || panelPhase === 'leaving';

  return (
    <footer className={styles['footer']}>
      <div>
        {step > 0 && stepId !== 'done' ? (
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={disabled}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
        ) : null}
      </div>
      <div className={styles['footer__right']}>
        {canSkip && stepId !== 'done' ? (
          <Button variant="ghost" onClick={onSkip} disabled={disabled}>
            Skip
          </Button>
        ) : null}
        <Button onClick={onNext} disabled={disabled} isLoading={isSubmitting}>
          {primaryCtaLabel}
        </Button>
      </div>
    </footer>
  );
};
