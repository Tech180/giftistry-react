import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { DashboardHeader } from './dashboard-header.component';

describe('DashboardHeader import control', () => {
  test('renders icon-only Import wishlist Button without Import Wishlist text', () => {
    const onToggleImport = vi.fn();

    render(
      <DashboardHeader
        greeting="Hello"
        isImportOpen={false}
        canShowAi
        onToggleImport={onToggleImport}
        onOpenCreate={vi.fn()}
      />
    );

    const importControl = screen.getByRole('button', { name: /import wishlist/i });
    expect(importControl).toBeInTheDocument();
    expect(screen.queryByText('Import Wishlist')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new wishlist/i })).toBeInTheDocument();

    fireEvent.click(importControl);
    expect(onToggleImport).toHaveBeenCalled();
  });
});
