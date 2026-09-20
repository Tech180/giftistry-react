import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Item } from '../../interfaces/item.interface';
import type { ItemActions } from '../../interfaces/item-actions.interface';
import { ClaimFooter } from './components/claim-footer/claim-footer.component';
import { OwnerActions } from './components/owner-actions/owner-actions.component';
import { ShowcaseTemplate } from './showcase.html';

const baseItem: Item = {
  Id: 'item-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Wireless Headphones',
  Description: 'Noise cancelling',
  IsHiddenIdea: false,
  Category: 'Electronics',
  Links: [],
  Claims: [],
  IsClaimed: false,
};

const noop = vi.fn();

const itemActions = {
  updateItem: noop,
  addItemLink: noop,
  claimItem: noop,
  claimItems: noop,
  unclaimItem: noop,
  deleteItem: noop,
} satisfies ItemActions;

const claimFooter = {
  isArchived: false,
  isExpired: false,
  isPublicGuest: false,
  canCollaborate: true,
  canEditItem: false,
  canAdjustClaim: false,
  claimedByCurrentUser: false,
  isFullyClaimed: false,
  isClaimUnavailable: false,
  claimLoading: false,
  showClaimForm: false,
  setShowClaimForm: noop,
  handleUnclaim: noop,
  substitutionAction: null,
  substitutionManageIconClassName: undefined,
  displayItem: baseItem,
  metadata: null,
  claimUserId: null,
  claimActorName: 'Test User',
  itemActions,
  anonymous: false,
  setAnonymous: noop,
  linkedClaimPeers: [],
  wishlistItemsForLinkedClaim: [],
  allowGroupFunds: false,
  totalExtractedPrice: 0,
  totalClaimedAmount: 0,
  showDeleteConfirm: false,
  setShowDeleteConfirm: noop,
  deleteLoading: false,
  handleDelete: noop,
};

const baseTemplateProps = {
  item: baseItem,
  displayItem: baseItem,
  claimUserId: null,
  isOwner: false,
  localIsFavorite: false,
  displayDescription: 'Noise cancelling',
  metadata: null,
  predefinedEntries: [],
  userDefinedEntries: [],
  totalExtractedPrice: 0,
  totalClaimedAmount: 0,
  progressPercent: 0,
  onClose: noop,
  getSiteName: () => 'Example',
  audienceLabel: null,
  displayCategory: 'Electronics',
  bestPriceDisplay: '—',
  quantityProgressMetric: '0%',
  hasNumericPriority: false,
  priorityDisplay: null,
  isLinkedToItems: false,
  isRelatedToItems: false,
  showGroupFunding: false,
  showQuantityProgress: false,
  showVariationsProgress: false,
  showHeroMeta: false,
  showSuggestionBadge: false,
  showHiddenSuggestionBadge: false,
  suggestionLabel: '',
  variationProgress: [],
  linkedRelationItems: [],
  relatedRelationItems: [],
  primaryImageUrl: null,
  rootClassName: 'showcase-root',
  audienceBadgeClassName: 'audience-badge',
  claimFooter,
};

describe('ShowcaseTemplate', () => {
  it('renders the item name in card variant', () => {
    render(
      <ShowcaseTemplate
        {...baseTemplateProps}
        variant = {
          'card'
        }
      />
    );

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('renders the item name in inline variant', () => {
    render(
      <ShowcaseTemplate
        {...baseTemplateProps}
        variant = {
          'inline'
        }
      />
    );

    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });
});

describe('OwnerActions', () => {
  it('shows delete confirm when delete is requested', () => {
    const setShowDeleteConfirm = vi.fn();
    render(
      <OwnerActions
        isArchived = {
          false
        }
        isExpired = {
          false
        }
        onEdit = {
          noop
        }
        showDeleteConfirm = {
          true
        }
        setShowDeleteConfirm = {
          setShowDeleteConfirm
        }
        deleteLoading = {
          false
        }
        handleDelete = {
          noop
        }
      />
    );

    expect(screen.getByText('Delete?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(setShowDeleteConfirm).toHaveBeenCalledWith(false);
  });
});

describe('ClaimFooter', () => {
  it('renders claim button for available item', () => {
    const setShowClaimForm = vi.fn();
    render(
      <ClaimFooter
        {...claimFooter}
        canCollaborate = {
          false
        }
        setShowClaimForm = {
          setShowClaimForm
        }
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Claim Item' }));
    expect(setShowClaimForm).toHaveBeenCalledWith(true);
  });

  it('renders unavailable label when fully claimed', () => {
    render(
      <ClaimFooter
        {...claimFooter}
        canCollaborate = {
          false
        }
        isFullyClaimed = {
          true
        }
      />
    );

    expect(screen.getByRole('button', { name: 'Already Claimed' })).toBeDisabled();
  });

  it('renders unclaim when claimed by current user', () => {
    const handleUnclaim = vi.fn();
    render(
      <ClaimFooter
        {...claimFooter}
        canCollaborate = {
          false
        }
        claimedByCurrentUser = {
          true
        }
        handleUnclaim = {
          handleUnclaim
        }
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Unclaim Item' }));
    expect(handleUnclaim).toHaveBeenCalled();
  });
});
