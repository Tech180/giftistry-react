import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './error-boundary.module.css';

export const ErrorBoundaryTemplate: React.FC<TemplateProps> = ({ onRetry }) => {
  return (
    <div
      className = {
        styles['error-boundary']
      }
    >
      <div
        className = {
          styles['error-boundary__panel']
        }
      >
        <h1
          className = {
            styles['error-boundary__title']
          }
        >
          Something went wrong
        </h1>
        <p
          className = {
            styles['error-boundary__message']
          }
        >
          An unexpected error occurred. You can try again or reload the page.
        </p>
        <Button
          variant = {
            'primary'
          }
          leftIcon = {
            <RefreshCw size={16} />
          }
          onClick = {
            onRetry
          }
        >
          Retry
        </Button>
      </div>
    </div>
  );
};
