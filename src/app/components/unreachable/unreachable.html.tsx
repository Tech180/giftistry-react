import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './unreachable.module.css';

export const UnreachableTemplate: React.FC<TemplateProps> = ({ onRetry }) => {
  return (
    <div
      className = {
        styles['unreachable']
      }
    >
      <div
        className = {
          styles['unreachable__panel']
        }
      >
        <h1
          className = {
            styles['unreachable__title']
          }
        >
          Cannot reach server
        </h1>
        <p
          className = {
            styles['unreachable__message']
          }
        >
          Giftistry could not connect to the API. Check that the backend is running and reachable from this browser.
        </p>
        <Button
          variant = {
            'primary'
          }
          leftIcon = {
            <RefreshCw size={16} />
          }
          onClick = {
            () => void onRetry()
          }
        >
          Retry
        </Button>
      </div>
    </div>
  );
};
