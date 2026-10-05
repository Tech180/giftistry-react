import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SettingsPanel } from './settings-panel.component';

describe('SettingsPanel group funding', () => {
  test('toggles allow group funds', () => {
    const onToggleAllowGroupFunds = vi.fn();
    render(
      <SettingsPanel
        aiEnabled={false}
        webSearchEnabled={false}
        manualJobBackground={true}
        autoRollover={false}
        allowGroupFunds={false}
        canShowAi={false}
        canShowWebSearch={false}
        onToggleAi={() => {}}
        onToggleWebSearch={() => {}}
        onToggleManualJobBackground={() => {}}
        onToggleAutoRollover={() => {}}
        onToggleAllowGroupFunds={onToggleAllowGroupFunds}
      />
    );

    fireEvent.click(screen.getByLabelText('Group funding disabled for this list. Click to enable.'));
    expect(onToggleAllowGroupFunds).toHaveBeenCalledTimes(1);
  });

  test('read-only viewer hides AI rows when capabilities are off', () => {
    render(
      <SettingsPanel
        aiEnabled={true}
        webSearchEnabled={true}
        manualJobBackground={true}
        autoRollover={false}
        allowGroupFunds={false}
        canShowAi={false}
        canShowWebSearch={false}
        readOnly
        onToggleAi={() => {}}
        onToggleWebSearch={() => {}}
        onToggleManualJobBackground={() => {}}
        onToggleAutoRollover={() => {}}
        onToggleAllowGroupFunds={() => {}}
      />
    );

    expect(screen.getByText('Group Funding')).toBeInTheDocument();
    expect(screen.getByText('Rollover')).toBeInTheDocument();
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
    expect(screen.queryByText('Web search')).not.toBeInTheDocument();
    expect(screen.queryByText('Background enrich')).not.toBeInTheDocument();
  });

  test('read-only viewer shows AI rows when capabilities are on', () => {
    render(
      <SettingsPanel
        aiEnabled={false}
        webSearchEnabled={false}
        manualJobBackground={false}
        autoRollover={false}
        allowGroupFunds={true}
        canShowAi={true}
        canShowWebSearch={true}
        readOnly
        onToggleAi={() => {}}
        onToggleWebSearch={() => {}}
        onToggleManualJobBackground={() => {}}
        onToggleAutoRollover={() => {}}
        onToggleAllowGroupFunds={() => {}}
      />
    );

    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Web search')).toBeInTheDocument();
    expect(screen.getByText('Background enrich')).toBeInTheDocument();
  });
});
