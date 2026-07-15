import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { AdminOverviewTabTemplate } from './admin-overview-tab.html';

describe('AdminOverviewTabTemplate', () => {
  test('renders overview stats without inline processes panel', () => {
    render(
      <MemoryRouter>
        <AdminOverviewTabTemplate
          isLoading={false}
          stats={{
            Users: { Total: 10, Active7d: 3, Disabled: 1, Locked: 0 },
            Lists: { Active: 5 },
            OpenReports: 2,
            MaintenanceMode: false,
          }}
          recentAudit={[]}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Total users')).toBeInTheDocument();
    expect(screen.queryByText('Background processes (instance)')).not.toBeInTheDocument();
  });
});
