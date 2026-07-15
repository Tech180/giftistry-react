import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { ProcessesRail } from './processes-rail.component';

vi.mock('features/jobs', () => ({
  useBackgroundJobs: () => ({
    jobs: [
      {
        Id: 'job-1',
        Kind: 'wishlist-import',
        ListId: 'list-1',
        UserId: 'user-1',
        Status: 'queued',
        Phase: 'queued',
        ProgressDone: 0,
        ProgressTotal: 0,
        Message: 'Queued',
        Error: null,
        FileName: 'import.csv',
      },
    ],
    error: null,
    isLoading: false,
    cancel: vi.fn(),
    suspend: vi.fn(),
    resume: vi.fn(),
  }),
  BackgroundProcessesPanel: ({
    jobs,
    title,
  }: {
    jobs: Array<{ FileName?: string }>;
    title?: string;
  }) => (
    <div>
      <span>{title}</span>
      <span>{jobs[0]?.FileName ?? 'empty'}</span>
    </div>
  ),
}));

describe('ProcessesRail', () => {
  test('wraps processes panel in shared sidebar layout', () => {
    render(<ProcessesRail scope="mine" onError={vi.fn()} />);

    expect(screen.getByRole('complementary', { name: 'Background processes' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Sidebar navigation' })).toBeInTheDocument();
    expect(screen.getByText('import.csv')).toBeInTheDocument();
  });

  test('uses instance title for admin scope', () => {
    render(
      <ProcessesRail
        scope="admin"
        title="Background processes (instance)"
        onError={vi.fn()}
      />
    );

    expect(
      screen.getByRole('complementary', { name: 'Background processes (instance)' })
    ).toBeInTheDocument();
    expect(screen.getByText('Background processes (instance)')).toBeInTheDocument();
  });
});
