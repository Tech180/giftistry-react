import React, { useId } from 'react';
import { Layers, RefreshCw, Search } from 'lucide-react';
import { Switch } from 'shared/ui';
import { AiDisabledIcon, AiSparklesIcon } from 'shared/ui/badge/icons/ai-badge-icons';
import styles from './list-settings-panel.module.css';

export interface ListSettingsPanelProps {
  aiEnabled: boolean;
  webSearchEnabled: boolean;
  manualJobBackground: boolean;
  autoRollover: boolean;
  canShowAi: boolean;
  canShowWebSearch: boolean;
  onToggleAi: () => void;
  onToggleWebSearch: () => void;
  onToggleManualJobBackground: () => void;
  onToggleAutoRollover: () => void;
}

export const ListSettingsPanel: React.FC<ListSettingsPanelProps> = ({
  aiEnabled,
  webSearchEnabled,
  manualJobBackground,
  autoRollover,
  canShowAi,
  canShowWebSearch,
  onToggleAi,
  onToggleWebSearch,
  onToggleManualJobBackground,
  onToggleAutoRollover,
}) => {
  const aiGradientId = `list-settings-ai-${useId().replace(/:/g, '')}`;

  return (
    <div className={styles.root} role="group" aria-label="List settings">
      <button
        type="button"
        className={[styles.row, autoRollover ? styles.rowActive : ''].filter(Boolean).join(' ')}
        onClick={onToggleAutoRollover}
        aria-pressed={autoRollover}
        aria-label={
          autoRollover
            ? 'Auto rollover enabled for this list. Click to disable.'
            : 'Auto rollover disabled for this list. Click to enable.'
        }
      >
        <span className={styles.rowIcon} aria-hidden>
          <RefreshCw size={16} />
        </span>
        <span className={styles.rowText}>
          <span className={styles.rowLabel}>Rollover</span>
          <span className={styles.rowMeta}>{autoRollover ? 'On' : 'Off'}</span>
        </span>
        <span
          className={styles.switchSlot}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Switch
            size="sm"
            checked={autoRollover}
            onChange={() => onToggleAutoRollover()}
            aria-label={autoRollover ? 'Disable rollover' : 'Enable rollover'}
          />
        </span>
      </button>

      {canShowAi ? (
        <button
          type="button"
          className={[styles.row, aiEnabled ? styles.rowActive : ''].filter(Boolean).join(' ')}
          onClick={onToggleAi}
          aria-pressed={aiEnabled}
          aria-label={
            aiEnabled
              ? 'AI enabled for this list. Click to disable.'
              : 'AI disabled for this list. Click to enable.'
          }
        >
          <span
            className={[styles.rowIcon, aiEnabled ? styles.rowIconAi : ''].filter(Boolean).join(' ')}
            aria-hidden
          >
            {aiEnabled ? (
              <>
                <AiSparklesIcon gradientId={aiGradientId} />
                <svg width="0" height="0" aria-hidden focusable="false">
                  <defs>
                    <linearGradient id={aiGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5E42F8" />
                      <stop offset="50%" stopColor="#B656CB" />
                      <stop offset="100%" stopColor="#F15565" />
                    </linearGradient>
                  </defs>
                </svg>
              </>
            ) : (
              <AiDisabledIcon />
            )}
          </span>
          <span className={styles.rowText}>
            <span className={styles.rowLabel}>AI</span>
            <span className={styles.rowMeta}>{aiEnabled ? 'On' : 'Off'}</span>
          </span>
          <span
            className={styles.switchSlot}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Switch
              size="sm"
              checked={aiEnabled}
              onChange={() => onToggleAi()}
              aria-label={aiEnabled ? 'Disable AI' : 'Enable AI'}
            />
          </span>
        </button>
      ) : null}

      {canShowWebSearch ? (
        <button
          type="button"
          className={[styles.row, webSearchEnabled ? styles.rowActive : '']
            .filter(Boolean)
            .join(' ')}
          onClick={onToggleWebSearch}
          aria-pressed={webSearchEnabled}
          aria-label={
            webSearchEnabled
              ? 'Web search enabled for this list. Click to disable.'
              : 'Web search disabled for this list. Click to enable.'
          }
        >
          <span className={styles.rowIcon} aria-hidden>
            <Search size={16} />
          </span>
          <span className={styles.rowText}>
            <span className={styles.rowLabel}>Web search</span>
            <span className={styles.rowMeta}>{webSearchEnabled ? 'On' : 'Off'}</span>
          </span>
          <span
            className={styles.switchSlot}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Switch
              size="sm"
              checked={webSearchEnabled}
              onChange={() => onToggleWebSearch()}
              aria-label={webSearchEnabled ? 'Disable web search' : 'Enable web search'}
            />
          </span>
        </button>
      ) : null}

      {canShowAi ? (
        <button
          type="button"
          className={[styles.row, manualJobBackground ? styles.rowActive : '']
            .filter(Boolean)
            .join(' ')}
          onClick={onToggleManualJobBackground}
          aria-pressed={manualJobBackground}
          aria-label={
            manualJobBackground
              ? 'Background enrich enabled for this list. Click to disable.'
              : 'Background enrich disabled for this list. Click to enable.'
          }
        >
          <span className={styles.rowIcon} aria-hidden>
            <Layers size={16} />
          </span>
          <span className={styles.rowText}>
            <span className={styles.rowLabel}>Background enrich</span>
            <span className={styles.rowMeta}>{manualJobBackground ? 'On' : 'Off'}</span>
          </span>
          <span
            className={styles.switchSlot}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Switch
              size="sm"
              checked={manualJobBackground}
              onChange={() => onToggleManualJobBackground()}
              aria-label={
                manualJobBackground ? 'Disable background enrich' : 'Enable background enrich'
              }
            />
          </span>
        </button>
      ) : null}
    </div>
  );
};
