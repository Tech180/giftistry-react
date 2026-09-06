import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ListSettingsPanel } from './list-settings-panel.component';

describe('ListSettingsPanel group funding', () => {
  test('toggles allow group funds', () => {
    const onToggleAllowGroupFunds = vi.fn();
    render(
      <ListSettingsPanel
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
});
