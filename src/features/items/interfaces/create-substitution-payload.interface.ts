import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

export interface CreateSubstitutionPayload {
  Name: string;
  Description?: string | null;
  LinkUrl?: string | null;
  Price?: number | null;
  WebsiteName?: string | null;
  Category?: string | null;
  PriorityId?: string | null;
  Priority?: number | null;
  /** Claimer custom: hide from list owner when true. */
  IsHiddenIdea?: boolean | null;
  Metadata?: ItemDescriptionMetadata | null;
}
