export function getSiteName(url: string, retailerName?: string | null): string {
  if (retailerName) return retailerName;
  try {
    const hostname = new URL(url).hostname;
    const domain = hostname.replace(/^www\./, '');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'View Store';
  }
}
