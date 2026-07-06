import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { EnterPanel } from './enter-panel.component';

describe('EnterPanel', () => {
  test('applies animation class after mount reflow', async () => {
    const { container } = render(
      <EnterPanel animation="dropdown" className="panel">
        Content
      </EnterPanel>
    );

    const panel = container.firstElementChild as HTMLElement;
    expect(panel.classList.contains('panel')).toBe(true);

    await waitFor(() => {
      expect(panel.classList.contains('animate-dropdown-in')).toBe(true);
    });
  });
});
