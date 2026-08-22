import type { MetadataPackFieldView } from './metadata-pack-field-view.interface';
import type { MetadataPackMatchView } from './metadata-pack-match-view.interface';

export interface CustomPackSettings {
  Id: string;
  Label: string;
  Description: string;
  Match: MetadataPackMatchView;
  Fields: MetadataPackFieldView[];
  PromptFragment: string;
}
