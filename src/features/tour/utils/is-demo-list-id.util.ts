import { TOUR_DEMO_LIST_ID } from '../constants/targets.constant';

export function isDemoListId(listId: string | null | undefined): boolean {
  return listId === TOUR_DEMO_LIST_ID;
}

export function isDemoListPath(pathname: string): boolean {
  return (
    pathname === `/wishlists/${TOUR_DEMO_LIST_ID}` ||
    pathname.startsWith(`/wishlists/${TOUR_DEMO_LIST_ID}/`)
  );
}
