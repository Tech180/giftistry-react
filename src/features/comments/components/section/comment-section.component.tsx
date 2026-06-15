import React, { useState, useEffect } from 'react';
import { useCommentController } from '../../hooks/use-comment-controller';
import { useAuth } from 'app/providers/AuthContext';
import { CommentSectionProps } from '../../interfaces/comment-section-props.interface';
import { CommentSectionTemplate } from './comment-section.html';

export const CommentSection: React.FC<CommentSectionProps> = ({ listId, isOwner }) => {
  const { user } = useAuth();
  
  const {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
  } = useCommentController();

  const [content, setContent] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isOwnerVisible, setIsOwnerVisible] = useState(true);
  const [isRollover, setIsRollover] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments(listId);
  }, [listId, fetchComments]);

  useEffect(() => {
    if (user) {
      setCommenterName(user.FirstName ? `${user.FirstName} ${user.LastName}` : user.Username);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitLoading(true);
    setLocalError(null);

    try {
      await addComment(
        listId,
        content.trim(),
        commenterName.trim() || null,
        isOwner ? true : isOwnerVisible,
        isRollover
      );
      setContent('');
      setIsRollover(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const displayError = error || localError;

  return (
    <CommentSectionTemplate
      isOwner={isOwner}
      currentUserId={user?.Id}
      comments={comments}
      isLoading={isLoading}
      displayError={displayError}
      content={content}
      setContent={setContent}
      commenterName={commenterName}
      setCommenterName={setCommenterName}
      isOwnerVisible={isOwnerVisible}
      setIsOwnerVisible={setIsOwnerVisible}
      isRollover={isRollover}
      setIsRollover={setIsRollover}
      isSubmitLoading={isSubmitLoading}
      handleSubmit={handleSubmit}
      formatDate={formatDate}
    />
  );
};
