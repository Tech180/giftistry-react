import type { CustomPackSettings } from '../interfaces/custom-pack-settings.interface';
import type { MetadataPackView } from '../interfaces/metadata-pack-view.interface';
import { builtInCatalogNodes } from './built-in-catalog-nodes.util';
import { toCustomPackView } from './to-custom-pack-view.util';

export function mergeWorkspaceCatalog(
  catalog: readonly MetadataPackView[],
  customPacks: readonly CustomPackSettings[]
): MetadataPackView[] {
  return [...builtInCatalogNodes(catalog), ...customPacks.map(toCustomPackView)];
}
