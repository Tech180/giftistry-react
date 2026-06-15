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
  
  // Link State/Handlers
  urlInput: string;
  setUrlInput: (val: string) => void;
  showAddLink: boolean;
  setShowAddLink: (val: boolean) => void;
  linkLoading: boolean;
  handleAddLink: (e: React.FormEvent) => void;

  // Claim State/Handlers
  showClaimForm: boolean;
  setShowClaimForm: (val: boolean) => void;
  claimAmount: string;
  setClaimAmount: (val: string) => void;
  claimedByName: string;
  setClaimedByName: (val: string) => void;
  claimLoading: boolean;
  handleClaim: (e: React.FormEvent) => void;
}
