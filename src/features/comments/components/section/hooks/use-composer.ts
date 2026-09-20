import { useEffect, useState, type SyntheticEvent } from 'react';
import { convertMentionsToMarkdown } from '../../../utils/comment-content.util';
import {
  COMMENT_ANON_STORAGE_KEY,
  ANONYMOUS_COMMENTER_NAME,
} from '../../../constants/comment-settings.constant';
import {
  DEFAULT_COMMENT_VISIBILITY,
  OWNER_DEFAULT_COMMENT_VISIBILITY,
} from '../../../constants/default-comment-visibility.constant';
import type { CommentVisibilityState } from '../../../interfaces/comment-visibility-state.interface';
import { resolveCommentVisibilityPayload } from '../../../utils/resolve-comment-visibility-payload.util';
import type { UseComposerParams } from '../interfaces/use-composer-params.interface';
import type { UseComposerResult } from '../interfaces/use-composer-result.interface';

export function useComposer({
  listId,
  isOwner,
  isArchived,
  isAuthenticated,
  autoRollover,
  userId,
  userUsername,
  participants,
  items,
  taggedItemIds,
  setTaggedItemIds,
  setIsTaggingModeActive,
  addComment,
  deleteComment,
  toggleReaction,
  notifyTypingStart,
  notifyTypingStop,
  onPosted,
  controllerError,
}: UseComposerParams): UseComposerResult {
  const [content, setContentState] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(() => {
    return localStorage.getItem(COMMENT_ANON_STORAGE_KEY) === 'true';
  });
  const [commentVisibility, setCommentVisibility] = useState<CommentVisibilityState>(() =>
    isOwner ? OWNER_DEFAULT_COMMENT_VISIBILITY : DEFAULT_COMMENT_VISIBILITY,
  );
  const [isRollover, setIsRollover] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userUsername) {
      setCommenterName(isAnonymous ? ANONYMOUS_COMMENTER_NAME : userUsername);
    } else {
      setCommenterName('');
    }
  }, [userUsername, isAnonymous]);

  const handleSetIsAnonymous = (anon: boolean) => {
    setIsAnonymous(anon);
    localStorage.setItem(COMMENT_ANON_STORAGE_KEY, anon ? 'true' : 'false');
  };

  const setContent = (val: string) => {
    setContentState(val);
    notifyTypingStart();
  };

  const handleSelectTagItem = (itemId: string, itemName: string) => {
    setContent(
      content ? `${content} [${itemName}](item:${itemId})` : `[${itemName}](item:${itemId})`,
    );
  };

  const handleReplySubmit = async (
    parentId: string,
    replyContent: string,
    replyCommenterName?: string | null,
    replyVisibility?: CommentVisibilityState,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null,
  ) => {
    if (isArchived) {
      return;
    }

    setIsSubmitLoading(true);
    setLocalError(null);

    try {
      const resolvedCommenterName =
        replyCommenterName?.trim() || commenterName?.trim() || userUsername;
      const formattedReplyContent = convertMentionsToMarkdown(replyContent, participants);
      const visibility = resolveCommentVisibilityPayload(
        replyVisibility ?? commentVisibility,
        isOwner,
      );
      await addComment(
        listId,
        formattedReplyContent,
        resolvedCommenterName || null,
        visibility.isOwnerVisible,
        autoRollover && (replyIsRollover !== undefined ? replyIsRollover : isRollover),
        parentId,
        replyImageUrl,
        visibility.visibleToUserIds,
      );
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to post reply.');
      throw err;
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleToggleReaction = async (commentId: string, reaction: string) => {
    if (!isAuthenticated || !userId || !userUsername) {
      return;
    }

    try {
      await toggleReaction(commentId, reaction, userId, userUsername);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to toggle reaction.');
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userId || isArchived) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    setIsSubmitLoading(true);
    setLocalError(null);
    notifyTypingStop();

    let finalContent = convertMentionsToMarkdown(content.trim(), participants);

    if (taggedItemIds.length > 0) {
      const tagLinks = taggedItemIds
        .map((id) => {
          const matchedItem = items.find((i) => i.Id === id);
          return matchedItem ? `[${matchedItem.Name}](item:${id})` : null;
        })
        .filter(Boolean)
        .join(' ');

      if (tagLinks) {
        finalContent += `\n\n${tagLinks}`;
      }
    }

    try {
      const visibility = resolveCommentVisibilityPayload(commentVisibility, isOwner);
      await addComment(
        listId,
        finalContent,
        commenterName.trim() || null,
        visibility.isOwnerVisible,
        autoRollover && isRollover,
        null,
        imageUrl,
        visibility.visibleToUserIds,
      );
      onPosted();
      setContentState('');
      setImageUrl(null);
      setIsRollover(false);
      setCommentVisibility(isOwner ? OWNER_DEFAULT_COMMENT_VISIBILITY : DEFAULT_COMMENT_VISIBILITY);
      setTaggedItemIds([]);
      setIsTaggingModeActive(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(listId, commentId);
      setDeletingCommentId(null);
    } catch {
      // Error is set in the controller hook
    }
  };

  const handleMentionSelect = (userId: string) => {
    setCommentVisibility((prev) => {
      if (prev.mode !== 'visibleToSelected') {
        return prev;
      }

      if (prev.selectedUserIds.includes(userId)) {
        return prev;
      }

      return { ...prev, selectedUserIds: [...prev.selectedUserIds, userId] };
    });
  };

  return {
    content,
    setContent,
    commenterName,
    setCommenterName,
    commentVisibility,
    setCommentVisibility,
    isRollover,
    setIsRollover,
    isSubmitLoading,
    displayError: controllerError || localError,
    isAnonymous,
    setIsAnonymous: handleSetIsAnonymous,
    imageUrl,
    setImageUrl,
    deletingCommentId,
    setDeletingCommentId,
    handleSubmit,
    handleReplySubmit,
    handleToggleReaction,
    handleDeleteComment,
    handleSelectTagItem,
    handleMentionSelect,
  };
}
