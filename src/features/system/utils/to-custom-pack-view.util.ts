import type { CustomPackSettings } from '../interfaces/custom-pack-settings.interface';
import type { MetadataPackView } from '../interfaces/metadata-pack-view.interface';

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
