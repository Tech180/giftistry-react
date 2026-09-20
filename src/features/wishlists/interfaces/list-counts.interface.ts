export interface ListCounts {
  My: number;
  Shared: number;
  Archive: number;
}

/** Stable alias for consumers that historically imported this name. */
export type WishlistListCounts = ListCounts;
