import React, { useId } from 'react';
import { Search } from 'lucide-react';
import { Switch } from 'shared/ui';
import { AiDisabledIcon, AiSparklesIcon } from 'shared/ui/badge/icons/ai-badge-icons';
import styles from './list-settings-panel.module.css';

export interface ListSettingsPanelProps {
  aiEnabled: boolean;
  webSearchEnabled: boolean;
  canShowAi: boolean;
  canShowWebSearch: boolean;
  onToggleAi: () => void;
  onToggleWebSearch: () => void;
}

export const ListSettingsPanel: React.FC<ListSettingsPanelProps> = ({
  aiEnabled,
  webSearchEnabled,
  canShowAi,
  canShowWebSearch,
  onToggleAi,
  onToggleWebSearch,
}) => {
  const aiGradientId = `list-settings-ai-${useId().replace(/:/g, '')}`;

  return (
    <div className={styles.root} role="group" aria-label="List settings">
      {canShowAi ? (
        <button
          type="button"
          className={[styles.row, aiEnabled ? styles.rowActive : ''].filter(Boolean).join(' ')}
          onClick={onToggleAi}
          aria-pressed={aiEnabled}
          aria-label={
            aiEnabled
              ? 'AI reviews enabled for this list. Click to disable.'
              : 'AI reviews disabled for this list. Click to enable.'
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
            <span className={styles.rowLabel}>AI reviews</span>
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
              aria-label={aiEnabled ? 'Disable AI reviews' : 'Enable AI reviews'}
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
    </div>
  );
};
