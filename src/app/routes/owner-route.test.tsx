import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import { OwnerRouteTemplate } from './owner-route.html';

describe('OwnerRouteTemplate', () => {
  test('renders children when user is owner', () => {
    render(
      <MemoryRouter>
        <OwnerRouteTemplate isLoading={false} isOwner isAdmin>
          <div>server settings</div>
        </OwnerRouteTemplate>
      </MemoryRouter>
    );

    expect(screen.getByText('server settings')).toBeInTheDocument();
  });

  test('redirects non-owner admins to admin overview', () => {
    render(
      <MemoryRouter initialEntries={['/settings/admin/server']}>
        <OwnerRouteTemplate isLoading={false} isOwner={false} isAdmin>
          <div>server settings</div>
        </OwnerRouteTemplate>
      </MemoryRouter>
    );

    expect(screen.queryByText('server settings')).not.toBeInTheDocument();
  });
});
