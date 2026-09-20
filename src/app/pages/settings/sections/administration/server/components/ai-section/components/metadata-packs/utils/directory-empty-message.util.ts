export function directoryEmptyMessage(search: string): string {
  if (search.trim()) {
    return 'No metadata packs match your search.';
  }

  return 'No metadata packs available.';
}
