import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { JobProgressBox } from './job-progress-box.html';
import type { BackgroundJobView } from '../../interfaces/background-job.interface';

const baseJob: BackgroundJobView = {
  Id: 'job-1',
  Kind: 'wishlist-import',
  ListId: 'list-1',
  UserId: 'user-1',
  Status: 'running',
  Phase: 'grabbing_info',
  ProgressDone: 2,
  ProgressTotal: 4,
  Message: 'Grabbing product details',
  Error: null,
};

describe('JobProgressBox', () => {
  test('renders timeline, percent-only meta during grab, and cancel action', () => {
    const onCancel = vi.fn();
    render(
      <JobProgressBox
        job={{
          ...baseJob,
          GrabInfo: true,
          Mode: 'create-list',
          ActiveStreams: [{ Id: 's1', ItemId: 'a', Label: 'Gadget', Status: 'running' }],
        }}
        onCancel={onCancel}
      />
    );

    expect(screen.getByLabelText(/import progress/i)).toBeInTheDocument();
    expect(screen.getByText('Grabbing product details')).toBeInTheDocument();
    const steps = screen.getByRole('list', { name: /import steps/i });
    expect(steps).toHaveTextContent('Grab info');
    const grabStep = within(steps)
      .getAllByRole('listitem')
      .find((item) => /Grab info/i.test(item.textContent || ''));
    expect(grabStep).toBeTruthy();
    expect(within(grabStep!).getByLabelText(/active grab streams/i)).toHaveTextContent('Gadget');
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.queryByText(/2\/4 · 50%/)).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  test('shows done/total meta outside grab phase', () => {
    render(
      <JobProgressBox
        job={{
          ...baseJob,
          Phase: 'adding_items',
          Message: 'Adding items…',
          ProgressDone: 2,
          ProgressTotal: 4,
          GrabInfo: false,
          Mode: 'create-list',
        }}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/2\/4 · 50%/)).toBeInTheDocument();
  });

  test('hides cancel when job is terminal', () => {
    render(
      <JobProgressBox
        job={{ ...baseJob, Status: 'failed', Phase: 'failed', Error: 'boom' }}
        onCancel={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.getByText('Import failed')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  test('shows completed summary title and grab failure message', () => {
    render(
      <JobProgressBox
        job={{
          ...baseJob,
          Status: 'completed',
          Phase: 'completed',
          Result: { Created: 120, GrabFailed: 85 },
        }}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText('Import complete')).toBeInTheDocument();
    expect(
      screen.getByText('Import finished — 120 items added, 85 grab failures')
    ).toBeInTheDocument();
  });
});
