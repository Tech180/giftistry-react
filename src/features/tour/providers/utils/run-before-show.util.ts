import type { NavigateFunction } from 'react-router-dom';
import type { TourBeforeShow, TourStepVariant } from '../../interfaces/step-def.interface';
import { TOUR_DEMO_LIST_ID, TOUR_TARGETS } from '../../constants/targets.constant';

const NAVIGATE_ACTIONS = new Set<TourBeforeShow>([
  'navigateDemo',
  'navigateDashboard',
  'navigateFriends',
  'navigateSettingsNotifications',
  'navigateSettingsTheming',
]);

const UI_RETRY_MS = 120;
const UI_RETRY_MAX_MS = 5000;
const POST_NAVIGATE_UI_DELAY_MS = 200;

export function runBeforeShow(beforeShow: TourStepVariant['beforeShow'], navigate: NavigateFunction): void {
  if (!beforeShow) {
    return;
  }

  const actions = Array.isArray(beforeShow) ? beforeShow : [beforeShow];
  const routeActions = actions.filter((action) => NAVIGATE_ACTIONS.has(action));
  const uiActions = actions.filter((action) => !NAVIGATE_ACTIONS.has(action));

  for (const action of routeActions) {
    runOne(action, navigate);
  }

  if (uiActions.length === 0) {
    return;
  }

  // Let the route paint before opening FAB/drawer/comments, then retry until ready.
  const delayMs = routeActions.length > 0 ? POST_NAVIGATE_UI_DELAY_MS : 0;
  window.setTimeout(() => {
    for (const action of uiActions) {
      runOne(action, navigate);
    }
  }, delayMs);
}

function runOne(beforeShow: TourBeforeShow, navigate: NavigateFunction): void {
  if (beforeShow === 'navigateDemo') {
    navigate(`/wishlists/${TOUR_DEMO_LIST_ID}`);
    return;
  }

  if (beforeShow === 'navigateDashboard') {
    navigate('/dashboard', { replace: true });
    return;
  }

  if (beforeShow === 'navigateFriends') {
    navigate('/friends/current');
    return;
  }

  if (beforeShow === 'navigateSettingsNotifications') {
    navigate('/settings/notifications');
    return;
  }

  if (beforeShow === 'navigateSettingsTheming') {
    navigate('/settings/theming');
    return;
  }

  if (beforeShow === 'openFab') {
    ensureFabOpen();
    return;
  }

  if (beforeShow === 'openDrawer') {
    retryUntil(() => {
      const hamburger = document.querySelector<HTMLButtonElement>('[aria-label="Open navigation menu"]');
      if (!hamburger) {
        return false;
      }

      if (hamburger.getAttribute('aria-expanded') !== 'true') {
        hamburger.click();
      }

      return true;
    });
    return;
  }

  if (beforeShow === 'openComments') {
    ensureCommentsOpen();
    return;
  }

  if (beforeShow === 'closeShare') {
    ensureShareClosed();
  }
}

function findShareCloseButton(): HTMLButtonElement | null {
  for (const dialog of document.querySelectorAll('[role="dialog"]')) {
    if (!dialog.textContent?.includes('Share Wishlist')) {
      continue;
    }

    const close = dialog.querySelector<HTMLButtonElement>('[aria-label="Close modal"]');
    if (close) {
      return close;
    }
  }

  for (const header of document.querySelectorAll('header')) {
    if (!header.textContent?.includes('Share Wishlist')) {
      continue;
    }

    const close = header.querySelector<HTMLButtonElement>('[aria-label="Close"]');
    if (close) {
      return close;
    }
  }

  return null;
}

/** Dismiss the desktop Share modal or mobile Share FAB panel if still open. */
export function ensureShareClosed(): void {
  retryUntil(() => {
    const close = findShareCloseButton();
    if (!close) {
      return true;
    }

    close.click();
    return !findShareCloseButton();
  });
}

/** Expand the page-actions FAB until the toolbar create action (or any tool) is measurable. */
export function ensureFabOpen(
  isActionReady: () => boolean = () =>
    Boolean(document.querySelector(`[data-tour="${TOUR_TARGETS.createWishlistFabAction}"]`))
): void {
  retryUntil(() => {
    if (isActionReady()) {
      return true;
    }

    const fab = document.querySelector<HTMLButtonElement>('[aria-label="Page actions"]');
    if (!fab) {
      return false;
    }

    // Closed face is measurable and not aria-hidden="true".
    if (fab.getAttribute('aria-hidden') !== 'true') {
      fab.click();
    }

    return isActionReady();
  });
}

function ensureCommentsOpen(): void {
  retryUntil(() => {
    const discussion = document.querySelector<HTMLElement>(`[data-tour="${TOUR_TARGETS.discussion}"]`);
    if (discussion) {
      if (discussion.getAttribute('aria-pressed') !== 'true') {
        discussion.click();
      }
      return true;
    }

    const commentsList = document.querySelector<HTMLElement>(`[data-tour="${TOUR_TARGETS.demoComments}"]`);
    if (commentsList && commentsList.getClientRects().length > 0) {
      return true;
    }

    const fab = document.querySelector<HTMLElement>(`[data-tour="${TOUR_TARGETS.commentsFab}"]`);
    if (fab) {
      fab.click();
      return true;
    }

    return false;
  });
}

export function retryUntil(attempt: () => boolean, options?: { intervalMs?: number; maxMs?: number }): void {
  const intervalMs = options?.intervalMs ?? UI_RETRY_MS;
  const maxMs = options?.maxMs ?? UI_RETRY_MAX_MS;
  const started = Date.now();

  const tick = () => {
    if (attempt()) {
      return;
    }

    if (Date.now() - started >= maxMs) {
      return;
    }

    window.setTimeout(tick, intervalMs);
  };

  tick();
}
