import type { ModerationComment } from './moderation-comment.interface';

export interface ModerationCommentsResponse {
  Comments: ModerationComment[];
  Page: number;
  Total: number;
}
