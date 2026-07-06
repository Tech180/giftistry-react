import { Item } from 'features/items';

export interface FooterProps {
  isOwner: boolean;
  isOwnerVisible: boolean;
  setIsOwnerVisible: (visible: boolean) => void;
  isRollover: boolean;
  setIsRollover: (rollover: boolean) => void;
  items: Item[];
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
}
