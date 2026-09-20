import type { MetadataPackView } from '../interfaces/metadata-pack-view.interface';
import { isCustomPackId } from './is-custom-pack-id.util';

export function builtInCatalogNodes(catalog: readonly MetadataPackView[]): MetadataPackView[] {
  return catalog.filter((node) => !node.IsCustom && !isCustomPackId(node.Id));
}
