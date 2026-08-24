import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ListViewControls } from './list-view-controls.component';

describe('ListViewControls', () => {
  const baseProps = {
    viewMode: 'detailed' as const,
    handleSetViewMode: vi.fn(),
    searchQuery: '',
    setSearchQuery: vi.fn(),
    addItemWidget: null,
  };

  it('omits kanban when supportsKanbanViewMode is false', () => {
    render(<ListViewControls {...baseProps} supportsKanbanViewMode={false} />);
    expect(screen.queryByRole('tab', { name: /kanban view/i })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /detailed view/i })).toBeInTheDocument();
  });

  it('includes kanban when supportsKanbanViewMode is true', () => {
    render(<ListViewControls {...baseProps} supportsKanbanViewMode />);
    expect(screen.getByRole('tab', { name: /kanban view/i })).toBeInTheDocument();
  });
});
