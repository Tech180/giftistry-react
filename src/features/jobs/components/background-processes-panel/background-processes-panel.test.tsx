import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { BackgroundProcessesPanel } from './background-processes-panel.html';
import type { BackgroundJobView } from '../../interfaces/background-job.interface';

const runningJob: BackgroundJobView = {
  Id: 'job-1',
  Kind: 'wishlist-import',
  ListId: 'list-1',
  UserId: 'user-abcdef12',
  Status: 'running',
  Phase: 'grabbing_info',
  ProgressDone: 1,
  ProgressTotal: 4,
  Message: 'Grabbing product details',
  Error: null,
  FileName: 'gifts.json',
};

const suspendedJob: BackgroundJobView = {
  ...runningJob,
  Id: 'job-2',
  Status: 'suspended',
  Phase: 'suspended',
  Message: 'Suspended',
};

describe('BackgroundProcessesPanel', () => {
  test('renders progress and cancel/suspend for active jobs', () => {
    const onCancel = vi.fn();
    const onSuspend = vi.fn();
    const onResume = vi.fn();

    render(
      <BackgroundProcessesPanel
        jobs={[runningJob]}
        variant="user"
        onCancel={onCancel}
        onSuspend={onSuspend}
        onResume={onResume}
      />
    );

    expect(screen.getByText('gifts.json')).toBeInTheDocument();
    expect(screen.getByText('Grabbing product details')).toBeInTheDocument();
    expect(screen.getByText('running')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');

    fireEvent.click(screen.getByRole('button', { name: /suspend/i }));
    expect(onSuspend).toHaveBeenCalledWith('job-1');

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledWith('job-1');
    expect(screen.queryByRole('button', { name: /resume/i })).not.toBeInTheDocument();
  });

  test('shows resume for suspended jobs and user id in admin variant', () => {
    const onResume = vi.fn();
    render(
      <BackgroundProcessesPanel
        jobs={[suspendedJob]}
        variant="admin"
        title="Background processes (instance)"
        onCancel={vi.fn()}
        onSuspend={vi.fn()}
        onResume={onResume}
      />
    );

    expect(screen.getByText('Background processes (instance)')).toBeInTheDocument();
    expect(screen.getByText(/user-abc/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /suspend/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    expect(onResume).toHaveBeenCalledWith('job-2');
  });

  test('shows empty state', () => {
    render(
      <BackgroundProcessesPanel
        jobs={[]}
        variant="user"
        emptyLabel="No background processes"
        onCancel={vi.fn()}
        onSuspend={vi.fn()}
        onResume={vi.fn()}
      />
    );
    expect(screen.getByText('No background processes')).toBeInTheDocument();
  });
});
