import type { ItemAiReviews } from '../../../../interfaces/item-ai-reviews.interface';

export interface Props {
  reviews: ItemAiReviews | null;
  reviewsLoading: boolean;
  reviewsError: string | null;
}
