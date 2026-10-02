import { AMAZON_SHORT_HOSTS } from '../constants/amazon-short-hosts.constant';

/** True when the URL host is an Amazon short-link domain (a.co / amzn.to / amzn.com). */
export function isAmazonShortLinkUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const hostname = new URL(trimmed).hostname.toLowerCase().replace(/^www\./, '');
    return AMAZON_SHORT_HOSTS.has(hostname);
  } catch {
    return false;
  }
}
