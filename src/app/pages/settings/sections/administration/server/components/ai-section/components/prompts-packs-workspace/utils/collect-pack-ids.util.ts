import type { SystemMetadataPackView } from 'features/system';

export function collectPackIds(nodes: readonly SystemMetadataPackView[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    ids.push(node.Id);
    if (node.Children?.length) ids.push(...collectPackIds(node.Children));
  }
  return ids;
}
