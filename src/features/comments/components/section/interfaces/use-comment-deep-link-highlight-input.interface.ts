import type { RefObject } from 'react';
import type { Comment } from '../../../interfaces/comment.interface';

export interface UseCommentDeepLinkHighlightInput {
  comments: Comment[];
  hasLoadedComments: boolean;
  isLoading: boolean;
  listContainerRef: RefObject<HTMLDivElement | null>;
  isDemo: boolean;
}
