import React, { useId, type ReactNode } from 'react';
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
  /** When true, settings are visible but not editable (viewers / collaborators / archived). */
  readOnly?: boolean;
}

interface SettingsRowProps {
  label: string;
  checked: boolean;
  readOnly: boolean;
  icon: ReactNode;
  iconClassName?: string;
  onToggle: () => void;
  viewLabel: string;
  editEnableLabel: string;
  editDisableLabel: string;
  switchEnableLabel: string;
  switchDisableLabel: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  checked,
  readOnly,
  icon,
  iconClassName,
  onToggle,
  viewLabel,
  editEnableLabel,
  editDisableLabel,
  switchEnableLabel,
  switchDisableLabel,
}) => {
  const rowClassName = [
    styles.row,
    checked ? styles.rowActive : '',
    readOnly ? styles.rowReadOnly : '',
  ]
    .filter(Boolean)
    .join(' ');

  const meta = checked ? 'On' : 'Off';
  const ariaLabel = readOnly
    ? viewLabel
    : checked
      ? editDisableLabel
      : editEnableLabel;

  const body = (
    <>
      <span className={[styles.rowIcon, iconClassName].filter(Boolean).join(' ')} aria-hidden>
        {icon}
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowMeta}>{meta}</span>
      </span>
      <span
        className={styles.switchSlot}
        onClick={readOnly ? undefined : (event) => event.stopPropagation()}
        onKeyDown={readOnly ? undefined : (event) => event.stopPropagation()}
      >
        <Switch
          size="sm"
          checked={checked}
          disabled={readOnly}
          onChange={readOnly ? () => undefined : () => onToggle()}
          aria-label={checked ? switchDisableLabel : switchEnableLabel}
        />
      </span>
    </>
  );

  if (readOnly) {
    return (
      <div className={rowClassName} aria-disabled="true" aria-label={ariaLabel}>
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={rowClassName}
      onClick={onToggle}
      aria-pressed={checked}
      aria-label={ariaLabel}
    >
      {body}
    </button>
  );
};

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
  readOnly = false,
}) => {
  const aiGradientId = `list-settings-ai-${useId().replace(/:/g, '')}`;
  const showAiRows = readOnly || canShowAi;
  const showWebSearchRow = readOnly || canShowWebSearch;

  return (
    <div
      className={[styles.root, readOnly ? styles.rootReadOnly : ''].filter(Boolean).join(' ')}
      role="group"
      aria-label="List settings"
    >
      <SettingsRow
        label="Rollover"
        checked={autoRollover}
        readOnly={readOnly}
        icon={<RefreshCw size={16} />}
        onToggle={onToggleAutoRollover}
        viewLabel={
          autoRollover ? 'Auto rollover is on for this list' : 'Auto rollover is off for this list'
        }
        editEnableLabel="Auto rollover disabled for this list. Click to enable."
        editDisableLabel="Auto rollover enabled for this list. Click to disable."
        switchEnableLabel="Enable rollover"
        switchDisableLabel="Disable rollover"
      />

      {showAiRows ? (
        <SettingsRow
          label="AI"
          checked={aiEnabled}
          readOnly={readOnly}
          iconClassName={aiEnabled ? styles.rowIconAi : undefined}
          icon={
            aiEnabled ? (
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
            )
          }
          onToggle={onToggleAi}
          viewLabel={aiEnabled ? 'AI is on for this list' : 'AI is off for this list'}
          editEnableLabel="AI disabled for this list. Click to enable."
          editDisableLabel="AI enabled for this list. Click to disable."
          switchEnableLabel="Enable AI"
          switchDisableLabel="Disable AI"
        />
      ) : null}

      {showWebSearchRow ? (
        <SettingsRow
          label="Web search"
          checked={webSearchEnabled}
          readOnly={readOnly}
          icon={<Search size={16} />}
          onToggle={onToggleWebSearch}
          viewLabel={
            webSearchEnabled ? 'Web search is on for this list' : 'Web search is off for this list'
          }
          editEnableLabel="Web search disabled for this list. Click to enable."
          editDisableLabel="Web search enabled for this list. Click to disable."
          switchEnableLabel="Enable web search"
          switchDisableLabel="Disable web search"
        />
      ) : null}

      {showAiRows ? (
        <SettingsRow
          label="Background enrich"
          checked={manualJobBackground}
          readOnly={readOnly}
          icon={<Layers size={16} />}
          onToggle={onToggleManualJobBackground}
          viewLabel={
            manualJobBackground
              ? 'Background enrich is on for this list'
              : 'Background enrich is off for this list'
          }
          editEnableLabel="Background enrich disabled for this list. Click to enable."
          editDisableLabel="Background enrich enabled for this list. Click to disable."
          switchEnableLabel="Enable background enrich"
          switchDisableLabel="Disable background enrich"
        />
      ) : null}
    </div>
  );
};
