import React from 'react';
import { Item } from './item.interface';

export interface ItemCardTemplateProps {
  item: Item;
  isOwner: boolean;
  isExpired: boolean;
  canCollaborate: boolean;
  allowGroupFunds: boolean;
  isFullyClaimed: boolean;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  priorityLabel?: string;
  
  // Link State/Handlers
  urlInput: string;
  setUrlInput: (val: string) => void;
  showAddLink: boolean;
  setShowAddLink: (val: boolean) => void;
  linkLoading: boolean;
  handleAddLink: (e: React.SubmitEvent<HTMLFormElement>) => void;

  // Claim State/Handlers
  showClaimForm: boolean;
  setShowClaimForm: (val: boolean) => void;
  claimAmount: string;
  setClaimAmount: (val: string) => void;
  claimedByName: string;
  setClaimedByName: (val: string) => void;
  claimLoading: boolean;
  handleClaim: (e: React.SubmitEvent<HTMLFormElement>) => void;

  // Delete State/Handlers
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (val: boolean) => void;
  deleteLoading: boolean;
  handleDelete: () => void;

  isFavorite: boolean;
  toggleFavorite: () => void;
  onEdit?: () => void;
}
