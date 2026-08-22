import type { DirectoryPackRow } from '../interfaces/directory-pack-row.interface';
import type { MetadataPackView } from '../interfaces/metadata-pack-view.interface';

interface FlatPackNode {
  Id: string;
  ancestorIds: string[];
  descendantIds: string[];
}

function collectDescendantIds(node: MetadataPackView): string[] {
  const ids: string[] = [];
  for (const child of node.Children ?? []) {
    ids.push(child.Id, ...collectDescendantIds(child));
  }
  return ids;
}

export function flattenMetadataPackCatalog(
  catalog: readonly MetadataPackView[],
  ancestors: readonly string[] = []
): FlatPackNode[] {
  const result: FlatPackNode[] = [];
  for (const node of catalog) {
    result.push({
      Id: node.Id,
      ancestorIds: [...ancestors],
      descendantIds: collectDescendantIds(node),
    });
    if (node.Children?.length) {
      result.push(...flattenMetadataPackCatalog(node.Children, [...ancestors, node.Id]));
    }
  }
  return result;
}

export function listDirectoryPacks(
  nodes: readonly MetadataPackView[],
  parentLabel: string | null = null
): DirectoryPackRow[] {
  const rows: DirectoryPackRow[] = [];
  for (const node of nodes) {
    rows.push({
      Id: node.Id,
      Label: node.Label,
      Description: node.Description,
      Fields: node.Fields ?? [],
      PromptFragment: node.PromptFragment ?? '',
      Match: node.Match ?? { Categories: [] },
      ParentLabel: parentLabel,
      IsRoot: parentLabel === null,
      IsCustom: Boolean(node.IsCustom),
    });
    if (node.Children?.length) {
      rows.push(...listDirectoryPacks(node.Children, node.Label));
    }
  }
  return rows;
}

export function filterDirectoryPacks(
  packs: readonly DirectoryPackRow[],
  search: string
): DirectoryPackRow[] {
  const query = search.trim().toLowerCase();
  if (!query) return [...packs];

  return packs.filter(
    (pack) =>
      pack.Label.toLowerCase().includes(query) || pack.Description.toLowerCase().includes(query)
  );
}

export function findDirectoryPack(
  packs: readonly DirectoryPackRow[],
  packId: string
): DirectoryPackRow | undefined {
  return packs.find((pack) => pack.Id === packId);
}

export function directoryEmptyMessage(search: string): string {
  if (search.trim()) return 'No metadata packs match your search.';
  return 'No metadata packs available.';
}

export function addMetadataPackId(
  catalog: readonly MetadataPackView[],
  enabledIds: readonly string[],
  packId: string
): string[] {
  const flat = flattenMetadataPackCatalog(catalog);
  const target = flat.find((node) => node.Id === packId);
  if (!target) return [...enabledIds];

  const next = new Set(enabledIds);
  next.add(packId);
  for (const ancestorId of target.ancestorIds) {
    next.add(ancestorId);
  }
  return flat.map((node) => node.Id).filter((id) => next.has(id));
}

export function removeMetadataPackId(
  catalog: readonly MetadataPackView[],
  enabledIds: readonly string[],
  packId: string
): string[] {
  const flat = flattenMetadataPackCatalog(catalog);
  const target = flat.find((node) => node.Id === packId);
  if (!target) return [...enabledIds];

  const next = new Set(enabledIds);
  next.delete(packId);
  for (const descendantId of target.descendantIds) {
    next.delete(descendantId);
  }

  for (const ancestorId of [...target.ancestorIds].reverse()) {
    const hasEnabledDescendant = flat.some(
      (node) => node.ancestorIds.includes(ancestorId) && next.has(node.Id)
    );
    if (!hasEnabledDescendant) {
      next.delete(ancestorId);
    }
  }

  return flat.map((node) => node.Id).filter((id) => next.has(id));
}
