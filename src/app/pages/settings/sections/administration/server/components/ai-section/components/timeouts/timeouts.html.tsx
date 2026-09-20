import React from 'react';
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
    <div className={styles['timeouts__field']}>
      <label className={styles['timeouts__label']} htmlFor="ai-connect-timeout-ms">
        AI connect timeout (ms)
      </label>
      <p className={styles['timeouts__subtitle']}>
        How long to wait when establishing a connection to the AI server before failing.
      </p>
      <input
        id="ai-connect-timeout-ms"
        type="number"
        min={1000}
        max={30000}
        step={500}
        className={styles['timeouts__input']}
        value={aiConnectTimeoutMs}
        onChange={(e) => setAiConnectTimeoutMs(Number(e.target.value))}
        disabled={!aiEnabled}
        aria-label="AI connect timeout in milliseconds"
      />
    </div>

    <div className={styles['timeouts__field']}>
      <label className={styles['timeouts__label']} htmlFor="ai-completion-timeout-ms">
        AI request timeout (ms)
      </label>
      <p className={styles['timeouts__subtitle']}>
        How long import, populate, and other AI calls may run before failing.
      </p>
      <input
        id="ai-completion-timeout-ms"
        type="number"
        min={30000}
        max={1800000}
        step={1000}
        className={styles['timeouts__input']}
        value={aiCompletionTimeoutMs}
        onChange={(e) => setAiCompletionTimeoutMs(Number(e.target.value))}
        disabled={!aiEnabled}
        aria-label="AI request timeout in milliseconds"
      />
    </div>
  </div>
);

export default TimeoutsTemplate;
