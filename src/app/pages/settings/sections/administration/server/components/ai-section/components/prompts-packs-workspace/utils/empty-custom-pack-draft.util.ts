import type { CustomPackSettings } from 'features/system';

export function emptyCustomPackDraft(): CustomPackSettings {
  return {
    Id: '',
    Label: '',
    Description: '',
    Match: { Categories: [] },
    Fields: [],
    PromptFragment: '',
  };
}
