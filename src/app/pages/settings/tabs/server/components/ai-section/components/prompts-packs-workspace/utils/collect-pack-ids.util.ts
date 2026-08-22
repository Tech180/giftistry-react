import type { MetadataPackView } from '../../metadata-packs/interfaces/metadata-pack-view.interface';

export function collectPackIds(nodes: readonly MetadataPackView[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.Id);
    if (node.Children?.length) ids.push(...collectPackIds(node.Children));
  }
  return ids;
}
