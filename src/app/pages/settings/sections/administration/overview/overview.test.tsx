import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { OverviewTemplate } from './overview.html';

describe('OverviewTemplate', () => {
  test('renders overview stats without inline processes panel', () => {
    render(
      <MemoryRouter>
        <OverviewTemplate
          isLoading={false}
          stats={{
            totalUsers: 10,
            active7d: 3,
            disabled: 1,
            locked: 0,
            activeLists: 5,
            openReports: 2,
          }}
          showMaintenanceBadge={false}
          recentAuditRows={[]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Total users')).toBeInTheDocument();
    expect(screen.queryByText('Background processes (instance)')).not.toBeInTheDocument();
  });
});
