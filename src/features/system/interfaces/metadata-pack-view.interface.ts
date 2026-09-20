import type { MetadataPackFieldView } from './metadata-pack-field-view.interface';
import type { MetadataPackMatchView } from './metadata-pack-match-view.interface';

export interface MetadataPackView {
  Id: string;
  Label: string;
  Description: string;
  Fields?: MetadataPackFieldView[];
  PromptFragment?: string;
  Match?: MetadataPackMatchView;
  IsCustom?: boolean;
  Children?: MetadataPackView[];
}
