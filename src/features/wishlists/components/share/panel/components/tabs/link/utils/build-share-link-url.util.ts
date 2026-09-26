export function buildShareLinkUrl(token: string): string {
  return `${window.location.origin}/invite/list/${token}`;
}
