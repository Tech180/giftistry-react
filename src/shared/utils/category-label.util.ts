export function formatCategoryLabel(cat: string | null | undefined): string {
  if (!cat || cat.toLowerCase() === 'uncategorized') return 'Uncategorized';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}
