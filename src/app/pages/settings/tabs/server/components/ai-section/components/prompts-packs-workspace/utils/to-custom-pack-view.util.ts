import type { CustomPackSettings } from '../../metadata-packs/interfaces/custom-pack-settings.interface';
import type { MetadataPackView } from '../../metadata-packs/interfaces/metadata-pack-view.interface';

export function toCustomPackView(pack: CustomPackSettings): MetadataPackView {
  return {
    Id: pack.Id,
    Label: pack.Label,
    Description: pack.Description,
    Fields: pack.Fields,
    PromptFragment: pack.PromptFragment,
    Match: pack.Match,
    IsCustom: true,
  };
}
