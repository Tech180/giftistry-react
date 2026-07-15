import { env } from 'core/config/env';

export interface WishlistExportContext {
  exporterName?: string;
  isOwner?: boolean;
  currentUserId?: string;
}

const toPascalCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9\s-_]+/g, '')
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const getFormattedDate = (): string => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${mm}${dd}${yyyy}`;
};

const getExportFilename = (title: string, exporterName: string | undefined, ext: string): string => {
  const pascalTitle = toPascalCase(title) || 'Wishlist';
  const dateStr = getFormattedDate();
  const exporterClean = toPascalCase(exporterName || 'Export');
  return `${pascalTitle}_${dateStr}_${exporterClean}.${ext}`;
};

async function downloadExportFile(
  listId: string,
  title: string,
  format: 'csv' | 'xlsx' | 'txt' | 'json' | 'pdf',
  exportContext: WishlistExportContext = {}
) {
  try {
    const token = localStorage.getItem('giftistry-token');
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const url = format === 'pdf'
      ? `${env.apiUrl}/api/wishlists/${listId}/pdf`
      : `${env.apiUrl}/api/wishlists/${listId}/export?format=${format}`;

    const response = await fetch(url, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to generate ${format.toUpperCase()}`);
    }
    const blob = await response.blob();
    downloadBlob(blob, getExportFilename(title, exportContext.exporterName, format));
  } catch (error) {
    console.error(`${format.toUpperCase()} export failed:`, error);
    alert(`Failed to download ${format.toUpperCase()}. Please try again.`);
  }
}

export function exportToCsv(listId: string, title: string, exportContext: WishlistExportContext = {}) {
  return downloadExportFile(listId, title, 'csv', exportContext);
}

export function exportToXlsx(listId: string, title: string, exportContext: WishlistExportContext = {}) {
  return downloadExportFile(listId, title, 'xlsx', exportContext);
}

export function exportToTxt(listId: string, title: string, exportContext: WishlistExportContext = {}) {
  return downloadExportFile(listId, title, 'txt', exportContext);
}

export function exportToJson(listId: string, title: string, exportContext: WishlistExportContext = {}) {
  return downloadExportFile(listId, title, 'json', exportContext);
}

export function exportToPdf(listId: string, title: string, exportContext: WishlistExportContext = {}) {
  return downloadExportFile(listId, title, 'pdf', exportContext);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.setAttribute('target', '_blank');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
