import { useState } from 'react';
// Future: AI item reviews — re-enable itemsApi.getItemReviews when shipping the feature.
// import { itemsApi } from '../api/items.api';

export interface ItemAiReviews {
  summary: string;
  pros: string[];
  cons: string[];
  reviews: string[];
}

/**
 * Fetch AI review synthesis for an item.
 * Disabled for now so opening items does not hit the /reviews AI path.
 * Re-enable the commented body when shipping the reviews feature.
 */
export function useItemAiReviews(
  itemId: string,
  enabled: boolean,
  hasLinks: boolean
) {
  // Future: AI item reviews — keep hook shape; skip fetch until the feature ships.
  void itemId;
  void enabled;
  void hasLinks;
  const [reviews] = useState<ItemAiReviews | null>(null);
  const [reviewsLoading] = useState(false);
  const [reviewsError] = useState<string | null>(null);

  // useEffect(() => {
  //   let active = true;
  //
  //   const fetchReviews = async () => {
  //     if (!enabled || !hasLinks) {
  //       setReviews(null);
  //       setReviewsError(null);
  //       return;
  //     }
  //
  //     setReviewsLoading(true);
  //     setReviewsError(null);
  //     try {
  //       const response = await itemsApi.getItemReviews(itemId);
  //       if (!active) return;
  //       if (response) {
  //         setReviews({
  //           summary: response.Summary,
  //           pros: response.Pros,
  //           cons: response.Cons,
  //           reviews: response.Reviews,
  //         });
  //       } else {
  //         setReviews(null);
  //       }
  //     } catch (err) {
  //       if (active) {
  //         setReviewsError(err instanceof Error ? err.message : 'Failed to load AI reviews');
  //       }
  //     } finally {
  //       if (active) {
  //         setReviewsLoading(false);
  //       }
  //     }
  //   };
  //
  //   fetchReviews();
  //   return () => {
  //     active = false;
  //   };
  // }, [itemId, enabled, hasLinks]);

  return { reviews, reviewsLoading, reviewsError };
}
