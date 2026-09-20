import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemSubstitutionOption } from '../../../interfaces/item-substitution.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';

export interface ParentFormSnapshot {
  name: string;
  description: string;
  priorityWeight: string;
  linkUrl: string;
  websiteName: string;
  category: string;
  price: string;
  isFavorite: boolean;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  customFields: CustomFieldRow[];
  dynamicValues: Record<string, string>;
  showExtraFields: boolean;
  photoEntries: ItemPhotoGalleryEntry[];
  initialPhotosSnapshot: string;
  photoError: string | null;
  otherUsersCanSee: boolean;
  isHiddenIdea: boolean;
  claimOnCreate: boolean;
  allowSubstitutions: boolean;
  substitutionOptions: ItemSubstitutionOption[];
  errorMsg: string | null;
  hasScraped: boolean;
  loadedMetadata: {
    predefined: Record<string, string | null | undefined>;
    userDefined: Record<string, string>;
  } | null;
}
