import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import {
  COLLABORATOR_TO_VIEWER_WARNING_DESCRIPTION,
  COLLABORATOR_TO_VIEWER_WARNING_PROCEED_PROMPT,
  COLLABORATOR_TO_VIEWER_WARNING_TITLE,
} from './constants/collaborator-to-viewer-warning.constant';
import { ShareManagement } from './management.component';

const listShares = vi.fn();
const updateShare = vi.fn();

vi.mock('features/wishlists/api/wishlists.api', () => ({
  wishlistsApi: {
    listShares: (...args: unknown[]) => listShares(...args),
    updateShare: (...args: unknown[]) => updateShare(...args),
    removeShare: vi.fn(),
  },
}));

const collaboratorShare: ListShare = {
  Id: 'share-1',
  ListId: 'list-1',
  UserId: 'user-1',
  Role: 'collaborator',
  FirstName: 'Alex',
  LastName: 'Rivera',
  Username: 'alexr',
  Email: 'alex@example.com',
};

const viewerShare: ListShare = {
  ...collaboratorShare,
  Id: 'share-2',
  Role: 'viewer',
  FirstName: 'Blake',
};

async function openRoleMenu(name: string) {
  const trigger = await screen.findByRole('button', { name: new RegExp(`Role for ${name}`, 'i') });
  fireEvent.click(trigger);
  return screen.getByRole('listbox');
}

describe('ShareManagement role change warning', () => {
  beforeEach(() => {
    listShares.mockReset();
    updateShare.mockReset();
  });

  test('shows caution view for collaborator to viewer and cancels without update', async () => {
    listShares.mockResolvedValue([collaboratorShare]);

    render(<ShareManagement listId="list-1" isOwner />);

    const listbox = await openRoleMenu('Alex Rivera');
    fireEvent.click(within(listbox).getByRole('option', { name: /Can View/i }));

    expect(screen.getByRole('heading', { name: COLLABORATOR_TO_VIEWER_WARNING_TITLE })).toBeInTheDocument();
    expect(screen.getByText(COLLABORATOR_TO_VIEWER_WARNING_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByText(COLLABORATOR_TO_VIEWER_WARNING_PROCEED_PROMPT)).toBeInTheDocument();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('@alexr')).toBeInTheDocument();
    expect(screen.getByLabelText('Alex Rivera')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Role for Alex Rivera/i })).toBeNull();
    expect(updateShare).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(await screen.findByRole('button', { name: /Role for Alex Rivera/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: COLLABORATOR_TO_VIEWER_WARNING_TITLE })).toBeNull();
    expect(updateShare).not.toHaveBeenCalled();
  });

  test('proceeds with collaborator to viewer demotion', async () => {
    listShares
      .mockResolvedValueOnce([collaboratorShare])
      .mockResolvedValueOnce([{ ...collaboratorShare, Role: 'viewer' }]);
    updateShare.mockResolvedValue(undefined);

    render(<ShareManagement listId="list-1" isOwner />);

    const listbox = await openRoleMenu('Alex Rivera');
    fireEvent.click(within(listbox).getByRole('option', { name: /Can View/i }));

    fireEvent.click(screen.getByRole('button', { name: 'Proceed' }));

    await waitFor(() => {
      expect(updateShare).toHaveBeenCalledWith('list-1', 'share-1', 'viewer');
    });
    expect(await screen.findByRole('button', { name: /Role for Alex Rivera/i })).toHaveTextContent(
      'Can View'
    );
    expect(screen.queryByRole('heading', { name: COLLABORATOR_TO_VIEWER_WARNING_TITLE })).toBeNull();
  });

  test('skips caution when promoting viewer to collaborator', async () => {
    listShares
      .mockResolvedValueOnce([viewerShare])
      .mockResolvedValueOnce([{ ...viewerShare, Role: 'collaborator' }]);
    updateShare.mockResolvedValue(undefined);

    render(<ShareManagement listId="list-1" isOwner />);

    const listbox = await openRoleMenu('Blake Rivera');
    fireEvent.click(within(listbox).getByRole('option', { name: /Can Edit/i }));

    await waitFor(() => {
      expect(updateShare).toHaveBeenCalledWith('list-1', 'share-2', 'collaborator');
    });
    expect(screen.queryByRole('heading', { name: COLLABORATOR_TO_VIEWER_WARNING_TITLE })).toBeNull();
  });
});
