import type { CustomPackSettings } from '../../metadata-packs/interfaces/custom-pack-settings.interface';

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
