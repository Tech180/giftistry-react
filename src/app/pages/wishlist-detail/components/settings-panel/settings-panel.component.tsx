import React, { useId } from 'react';
import type { ReactNode } from 'react';
import { Layers, RefreshCw, Search, Users } from 'lucide-react';
import { AiDisabledIcon, AiSparklesIcon } from 'shared/ui';
import {
  AI_COPY,
  BACKGROUND_ENRICH_COPY,
  GROUP_FUNDING_COPY,
  PANEL_ARIA_LABEL,
  ROLLOVER_COPY,
  WEB_SEARCH_COPY,
} from './constants/copy.constant';
import type { RowCopy } from './interfaces/row-copy.interface';
import type { Props } from './interfaces/props.interface';
import type { SettingsRowView } from './interfaces/settings-row-view.interface';
import { getRootClassName } from './utils/get-root-class-name.util';
import { getRowClassName } from './utils/get-row-class-name.util';
import { getRowIconClassName } from './utils/get-row-icon-class-name.util';
import { getRowAriaLabel, getRowMeta, getSwitchAriaLabel } from './utils/get-row-labels.util';
import { getRowMetaClassName } from './utils/get-row-meta-class-name.util';
import { SettingsPanelTemplate } from './settings-panel.html';
import styles from './settings-panel.module.css';

export const SettingsPanel: React.FC<Props> = ({
  aiEnabled,
  webSearchEnabled,
  manualJobBackground,
  autoRollover,
  allowGroupFunds,
  canShowAi,
  canShowWebSearch,
  onToggleAi,
  onToggleWebSearch,
  onToggleManualJobBackground,
  onToggleAutoRollover,
  onToggleAllowGroupFunds,
  readOnly = false,
}) => {
  const aiGradientId = `settings-panel-ai-${useId().replace(/:/g, '')}`;
  const showAiRows = readOnly || canShowAi;
  const showWebSearchRow = readOnly || canShowWebSearch;

  const buildRow = (
    key: string,
    checked: boolean,
    copy: RowCopy,
    onToggle: () => void,
    icon: ReactNode,
    extraIconClassName?: string
  ): SettingsRowView => ({
    key,
    label: copy.label,
    checked,
    readOnly,
    icon,
    iconClassName: getRowIconClassName(extraIconClassName),
    rowClassName: getRowClassName(checked, readOnly),
    metaClassName: getRowMetaClassName(checked),
    meta: getRowMeta(checked),
    ariaLabel: getRowAriaLabel(readOnly, checked, copy),
    switchAriaLabel: getSwitchAriaLabel(checked, copy),
    onToggle,
  });

  const aiIcon = aiEnabled ? (
    <>
      <AiSparklesIcon gradientId={aiGradientId} />
      <svg width="0" height="0" aria-hidden focusable="false">
        <defs>
          <linearGradient id={aiGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--error)" />
          </linearGradient>
        </defs>
      </svg>
    </>
  ) : (
    <AiDisabledIcon />
  );

  const rows: SettingsRowView[] = [
    buildRow('group-funding', allowGroupFunds, GROUP_FUNDING_COPY, onToggleAllowGroupFunds, <Users size={16} />),
    buildRow('rollover', autoRollover, ROLLOVER_COPY, onToggleAutoRollover, <RefreshCw size={16} />),
  ];

  if (showAiRows) {
    rows.push(
      buildRow(
        'ai',
        aiEnabled,
        AI_COPY,
        onToggleAi,
        aiIcon,
        aiEnabled ? styles['settings-panel__row-icon--ai'] : undefined
      )
    );
  }

  if (showWebSearchRow) {
    rows.push(buildRow('web-search', webSearchEnabled, WEB_SEARCH_COPY, onToggleWebSearch, <Search size={16} />));
  }

  if (showAiRows) {
    rows.push(
      buildRow(
        'background-enrich',
        manualJobBackground,
        BACKGROUND_ENRICH_COPY,
        onToggleManualJobBackground,
        <Layers size={16} />
      )
    );
  }

  return (
    <SettingsPanelTemplate
      rootClassName = {
        getRootClassName(readOnly)
      }
      panelAriaLabel = {
        PANEL_ARIA_LABEL
      }
      rows = {
        rows
      }
    />
  );
};
