import React from 'react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './apply-bar.module.css';

export const ApplyBarTemplate: React.FC<TemplateProps> = ({
  buttonLabel,
  onApply,
}) => {
  const buttonVariant = buttonLabel === 'Cancel' ? 'secondary' : 'primary';

  return (
  <div
    className = {
      styles['apply-bar']
    }
    data-testid = {
      'link-apply-bar'
    }
  >
    <Button
      type = {
        'button'
      }
      variant = {
        buttonVariant
      }
      size = {
        'lg'
      }
      className = {
        styles['apply-bar__btn']
      }
      onClick = {
        onApply
      }
    >
      {buttonLabel}
    </Button>
  </div>
  );
};
