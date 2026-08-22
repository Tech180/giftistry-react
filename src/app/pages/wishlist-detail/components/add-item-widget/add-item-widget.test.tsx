import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('features/jobs', () => ({
  jobsApi: {
    startItemEnrich: vi.fn(),
  },
}));

import { AddItemWidget } from './add-item-widget.component';
import { jobsApi } from 'features/jobs';

describe('AddItemWidget', () => {
  const baseProps = {
    listId: 'list-1',
    isInputMode: false,
    canAutoAdd: true,
    onEnterInputMode: vi.fn(),
    onExitInputMode: vi.fn(),
    onManual: vi.fn(),
    onStarted: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('hides Auto when auto-add is disabled', () => {
    render(<AddItemWidget {...baseProps} canAutoAdd={false} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open add options' }));
    expect(screen.queryByRole('button', { name: 'Auto' })).not.toBeInTheDocument();
    expect(screen.queryByRole('form', { name: 'Auto add item from link' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Manual' }));
    expect(baseProps.onManual).toHaveBeenCalled();
  });

  test('Auto enters input mode and Manual calls onManual', () => {
    render(<AddItemWidget {...baseProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open add options' }));
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }));
    expect(baseProps.onEnterInputMode).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Open add options' }));
    fireEvent.click(screen.getByRole('button', { name: 'Manual' }));
    expect(baseProps.onManual).toHaveBeenCalled();
  });

  test('toggles the add options menu on the plus button', () => {
    render(<AddItemWidget {...baseProps} />);

    const toggle = screen.getByRole('button', { name: 'Open add options' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Close add options' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close add options' }));
    expect(screen.getByRole('button', { name: 'Open add options' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('starts a create-from-url enrich job and reports the result', async () => {
    const started = { Job: { Id: 'job-1' }, Item: { Id: 'item-1', Name: 'Cool Hoodie' } };
    vi.mocked(jobsApi.startItemEnrich).mockResolvedValue(started as any);
    const onStarted = vi.fn();
    const onExitInputMode = vi.fn();

    render(
      <AddItemWidget
        {...baseProps}
        isInputMode={true}
        onStarted={onStarted}
        onExitInputMode={onExitInputMode}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByRole('button', { name: /auto-add from link/i }));

    await waitFor(() => {
      expect(jobsApi.startItemEnrich).toHaveBeenCalledWith({
        intent: 'create-from-url',
        listId: 'list-1',
        url: 'https://shop.example/hoodie',
        writeBack: true,
      });
    });

    await waitFor(() => {
      expect(onStarted).toHaveBeenCalledWith(started);
      expect(onExitInputMode).toHaveBeenCalled();
    });
  });

  test('rejects an invalid url without calling the API', async () => {
    render(<AddItemWidget {...baseProps} isInputMode={true} />);

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'not-a-url' },
    });
    fireEvent.click(screen.getByRole('button', { name: /auto-add from link/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid product URL.');
    });
    expect(jobsApi.startItemEnrich).not.toHaveBeenCalled();
  });

  test('surfaces API failures', async () => {
    vi.mocked(jobsApi.startItemEnrich).mockRejectedValue(new Error('Scrape blocked'));

    render(<AddItemWidget {...baseProps} isInputMode={true} />);

    fireEvent.change(screen.getByPlaceholderText('Paste product URL...'), {
      target: { value: 'https://shop.example/hoodie' },
    });
    fireEvent.click(screen.getByRole('button', { name: /auto-add from link/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Scrape blocked');
    });
  });

  test('cancel exits input mode', () => {
    const onExitInputMode = vi.fn();
    render(
      <AddItemWidget {...baseProps} isInputMode={true} onExitInputMode={onExitInputMode} />
    );

    fireEvent.click(screen.getByRole('button', { name: /close auto add/i }));
    expect(onExitInputMode).toHaveBeenCalled();
  });
});
