import type { MetadataPackFieldView } from './metadata-pack-field-view.interface';
import type { MetadataPackMatchView } from './metadata-pack-match-view.interface';

export interface DirectoryPackRow {
  Id: string;
  Label: string;
  Description: string;
  Fields: MetadataPackFieldView[];
  PromptFragment: string;
  Match: MetadataPackMatchView;
  ParentLabel: string | null;
  IsRoot: boolean;
  IsCustom: boolean;
}
