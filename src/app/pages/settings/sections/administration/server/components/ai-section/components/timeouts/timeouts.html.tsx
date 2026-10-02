import React from 'react';
import { Timer } from 'lucide-react';
import { NumberSelector } from 'shared/ui';
import type { TimeoutsTemplateProps } from './interfaces/template-props.interface';
import styles from './timeouts.module.css';

export const TimeoutsTemplate: React.FC<TimeoutsTemplateProps> = ({
  aiEnabled,
  aiConnectTimeoutMs,
  setAiConnectTimeoutMs,
  aiCompletionTimeoutMs,
  setAiCompletionTimeoutMs,
}) => (
  <div className={styles.timeouts}>
    <div className={styles['timeouts__card']}>
      <div className={styles['timeouts__card-header']}>
        <div className={styles['timeouts__header-left']}>
          <div className={styles['timeouts__icon']} aria-hidden="true">
            <Timer size={16} className={styles['timeouts__icon-svg']} />
          </div>
          <div>
            <h3 className={styles['timeouts__title']}>AI timeouts</h3>
            <p className={styles['timeouts__subtitle']}>
              Configure connection and request timeouts for AI operations.
            </p>
          </div>
        </div>
      </div>

      <div className={styles['timeouts__body']}>
        <div className={styles['timeouts__grid']}>
          <div className={styles['timeouts__field']}>
            <div className={styles['timeouts__field-info']}>
              <label className={styles['timeouts__label']}>AI connect timeout (ms)</label>
              <p className={styles['timeouts__hint']}>
                How long to wait when establishing a connection to the AI server before failing.
              </p>
            </div>
            <NumberSelector
              value = {
                aiConnectTimeoutMs
              }
              min = {
                1000
              }
              max = {
                30000
              }
              onChange = {
                setAiConnectTimeoutMs
              }
              disabled = {
                !aiEnabled
              }
              editLabel = {
                'AI connect timeout in milliseconds'
              }
              decreaseLabel = {
                'Decrease AI connect timeout'
              }
              increaseLabel = {
                'Increase AI connect timeout'
              }
            />
          </div>

          <div className={styles['timeouts__field']}>
            <div className={styles['timeouts__field-info']}>
              <label className={styles['timeouts__label']}>AI request timeout (ms)</label>
              <p className={styles['timeouts__hint']}>
                How long import, populate, and other AI calls may run before failing.
              </p>
            </div>
            <NumberSelector
              value = {
                aiCompletionTimeoutMs
              }
              min = {
                30000
              }
              max = {
                1800000
              }
              onChange = {
                setAiCompletionTimeoutMs
              }
              disabled = {
                !aiEnabled
              }
              editLabel = {
                'AI request timeout in milliseconds'
              }
              decreaseLabel = {
                'Decrease AI request timeout'
              }
              increaseLabel = {
                'Increase AI request timeout'
              }
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TimeoutsTemplate;
