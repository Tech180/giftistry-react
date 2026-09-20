import React from 'react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './apply-bar.module.css';

export const ApplyBarTemplate: React.FC<TemplateProps> = ({
  onApply,
}) => (
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
        'primary'
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
      Apply
    </Button>
  </div>
);
