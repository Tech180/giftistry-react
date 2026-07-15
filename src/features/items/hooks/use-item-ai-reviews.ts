import { useEffect, useState } from 'react';
import { itemsApi } from '../api/items.api';

export interface ItemAiReviews {
  summary: string;
  pros: string[];
  cons: string[];
  reviews: string[];
}

export function useItemAiReviews(
  itemId: string,
  enabled: boolean,
  hasLinks: boolean
) {
  const [reviews, setReviews] = useState<ItemAiReviews | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchReviews = async () => {
      if (!enabled || !hasLinks) {
        setReviews(null);
        setReviewsError(null);
        return;
      }

      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await itemsApi.getItemReviews(itemId);
        if (!active) return;
        if (response) {
          setReviews({
            summary: response.Summary,
            pros: response.Pros,
            cons: response.Cons,
            reviews: response.Reviews,
          });
        } else {
          setReviews(null);
        }
      } catch (err) {
        if (active) {
          setReviewsError(err instanceof Error ? err.message : 'Failed to load AI reviews');
        }
      } finally {
        if (active) {
          setReviewsLoading(false);
        }
      }
    };

    fetchReviews();
    return () => {
      active = false;
    };
  }, [itemId, enabled, hasLinks]);

  return { reviews, reviewsLoading, reviewsError };
}
