export interface ListChangedEvent {
  reason: string;
  itemId?: string;
  actorUserId?: string;
}

export interface UseWishlistJobOptions {
  onListChanged?: (event: ListChangedEvent) => void;
}
