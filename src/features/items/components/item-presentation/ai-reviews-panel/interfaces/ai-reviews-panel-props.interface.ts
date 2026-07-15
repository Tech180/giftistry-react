import type { ItemAiReviews } from '../../../../../hooks/use-item-ai-reviews';

export interface AiReviewsPanelProps {
  reviews: ItemAiReviews | null;
  reviewsLoading: boolean;
  reviewsError: string | null;
}
