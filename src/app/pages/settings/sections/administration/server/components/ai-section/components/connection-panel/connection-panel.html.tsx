import React from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import type { ConnectionPanelTemplateProps } from './interfaces/template-props.interface';
import styles from './connection-panel.module.css';
import segmentStyles from '../../../../../segmented-control.module.css';

export const ConnectionPanelTemplate: React.FC<ConnectionPanelTemplateProps> = ({
  aiEnabled,
  connectionSlot,
  setConnectionSlot,
  isFastSlot,
  activeProvider,
  setActiveProvider,
  activeEndpoint,
  setActiveEndpoint,
  activeApiKey,
  setActiveApiKey,
  showActiveAiKey,
  setShowActiveAiKey,
  activeConnectionStatus,
  activeConnectionMessage,
  isTestingAiConnection,
  onTestAiConnection,
}) => (
  <div className={styles['connection-panel']}>
    <h3 className={styles['connection-panel__title']}>Connection</h3>

    <div className={`${segmentStyles['segmented-control']} ${segmentStyles['segmented-control--stretch']}`}>
      <button
        type="button"
        className={`${segmentStyles['segmented-control__btn']} ${segmentStyles['segmented-control__btn--stretch']} ${isFastSlot ? segmentStyles['segmented-control__btn--active'] : ''}`}
        onClick={() => setConnectionSlot('fast')}
      >
        Fast
      </button>
      <button
        type="button"
        className={`${segmentStyles['segmented-control__btn']} ${segmentStyles['segmented-control__btn--stretch']} ${!isFastSlot ? segmentStyles['segmented-control__btn--active'] : ''}`}
        onClick={() => setConnectionSlot('intelligent')}
      >
        Intelligent
      </button>
    </div>

    <div className={`${segmentStyles['segmented-control']} ${segmentStyles['segmented-control--stretch']}`}>
      <button
        type="button"
        className={`${segmentStyles['segmented-control__btn']} ${segmentStyles['segmented-control__btn--stretch']} ${activeProvider === 'local' ? segmentStyles['segmented-control__btn--active'] : ''}`}
        onClick={() => setActiveProvider('local')}
      >
        Local Instance
      </button>
      <button
        type="button"
        className={`${segmentStyles['segmented-control__btn']} ${segmentStyles['segmented-control__btn--stretch']} ${activeProvider !== 'local' ? segmentStyles['segmented-control__btn--active'] : ''}`}
        onClick={() => setActiveProvider('openrouter')}
      >
        Global Models (API)
      </button>
    </div>

    <div className={styles['connection-panel__grid']}>
      <div className={styles['connection-panel__row']}>
        <div className={styles['connection-panel__group']}>
          <label className={styles['connection-panel__label']}>
            {activeProvider === 'local' ? 'API Key' : 'API Key *'}
          </label>
          <div className={styles['connection-panel__input-box']}>
            <input
              type={showActiveAiKey ? 'text' : 'password'}
              className={styles['connection-panel__input']}
              placeholder="Secret"
              value={activeApiKey}
              onChange={(e) => setActiveApiKey(e.target.value)}
              required={aiEnabled && activeProvider !== 'local'}
            />
            <button
              type="button"
              className={styles['connection-panel__icon-btn']}
              onClick={() => setShowActiveAiKey(!showActiveAiKey)}
            >
              {showActiveAiKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className={styles['connection-panel__group']}>
          <div className={styles['connection-panel__label-row']}>
            <label className={styles['connection-panel__label']}>API Endpoint URL</label>
            {activeProvider === 'local' && activeConnectionStatus !== 'idle' ? (
              <span
                className={`${styles['connection-panel__status']} ${
                  activeConnectionStatus === 'success'
                    ? styles['connection-panel__status--success']
                    : activeConnectionStatus === 'error'
                      ? styles['connection-panel__status--error']
                      : styles['connection-panel__status--checking']
                }`}
                title={activeConnectionMessage}
                aria-label={activeConnectionMessage}
                role="status"
              >
                {activeConnectionStatus === 'success' ? <CheckCircle2 size={14} /> : null}
                {activeConnectionStatus === 'error' ? <AlertCircle size={14} /> : null}
                {activeConnectionStatus === 'checking' ? (
                  <Loader2 size={14} className={styles['connection-panel__spinner']} />
                ) : null}
              </span>
            ) : null}
          </div>
          <div className={styles['connection-panel__endpoint-row']}>
            <input
              type="text"
              className={`${styles['connection-panel__input']} ${styles['connection-panel__input--endpoint']}`}
              placeholder={
                activeProvider === 'local' ? 'http://localhost:11434/v1' : 'https://openrouter.ai/api/v1'
              }
              value={activeEndpoint}
              onChange={(e) => setActiveEndpoint(e.target.value)}
              required={aiEnabled && activeProvider === 'local'}
            />
            {activeProvider === 'local' ? (
              <button
                type="button"
                className={styles['connection-panel__refresh']}
                onClick={() => onTestAiConnection(connectionSlot)}
                disabled={isTestingAiConnection || !activeEndpoint.trim()}
                title="Test connection"
                aria-label="Test connection"
              >
                <RefreshCw
                  size={14}
                  className={isTestingAiConnection ? styles['connection-panel__spinner'] : undefined}
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ConnectionPanelTemplate;
