import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SharePanelTemplate } from './panel.html';

describe('SharePanelTemplate', () => {
  test('renders Friends, Link, and Manage tabs without Email', () => {
    const setActiveTab = vi.fn();

    render(
      <SharePanelTemplate
        activeTab="friends"
        setActiveTab={setActiveTab}
        isOwner
        manageCount={2}
        friendsTab={<div>Friends pane</div>}
        linkTab={<div>Link pane</div>}
        manageTab={<div>Manage pane</div>}
      />
    );

    expect(screen.getByRole('button', { name: 'Friends' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manage/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Email' })).toBeNull();
    expect(screen.getByText('Friends pane')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('switches active tab panes', () => {
    const setActiveTab = vi.fn();

    render(
      <SharePanelTemplate
        activeTab="link"
        setActiveTab={setActiveTab}
        isOwner
        manageCount={0}
        friendsTab={<div>Friends pane</div>}
        linkTab={<div>Link pane</div>}
        manageTab={<div>Manage pane</div>}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Link' }));
    expect(setActiveTab).toHaveBeenCalledWith('link');
    expect(screen.getByText('Link pane')).toBeInTheDocument();
  });
});
