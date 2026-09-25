import { USER_JORDAN, USER_SAM } from '../constants/users.constant';
import type { Comment } from '../interfaces/comment.interface';

export const DEMO_SAM_COMMENT_ID = 'tour-demo-comment-sam';

export function buildSeedComments(listId: string): Comment[] {
  return [
    {
      Id: 'tour-demo-comment-1',
      ListId: listId,
      UserId: USER_JORDAN,
      Username: 'Jordan',
      Body: 'Love the headphones idea!',
      CreatedAt: new Date().toISOString(),
    },
  ];
}

export function buildSamComment(listId: string): Comment {
  return {
    Id: DEMO_SAM_COMMENT_ID,
    ListId: listId,
    UserId: USER_SAM,
    Username: 'Sam',
    Body: 'I can grab the headphones if nobody else has.',
    CreatedAt: new Date().toISOString(),
  };
}
