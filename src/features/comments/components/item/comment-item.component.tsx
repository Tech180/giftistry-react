import React from 'react';
import { CommentItemProps } from './comment-item.interface';
import { CommentItemTemplate } from './comment-item.html';

const parseCommentTagsAndText = (text: string) => {
  const regex = /\[([^\]]+)\]\(item:([^)]+)\)/g;
  const taggedIds: string[] = [];

  let match;
  while ((match = regex.exec(text)) !== null) {
    const itemId = match[2];
    if (!taggedIds.includes(itemId)) {
      taggedIds.push(itemId);
    }
  }

  let cleanText = text;
  cleanText = cleanText.replace(/\n*🏷️?\s*Tagged\s*Items:\s*/gi, '');
  cleanText = cleanText.replace(/\[([^\]]+)\]\(item:[^)]+\)/g, '');
  cleanText = cleanText.trim();

  return {
    cleanText,
    taggedIds,
  };
};

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  items,
  formatDate,
  onItemTaggedClick,
  handleDeleteComment,
  deletingCommentId,
  setDeletingCommentId,
}) => {
  const { cleanText, taggedIds } = parseCommentTagsAndText(comment.Content);
  const isDeleting = deletingCommentId === comment.Id;

  return (
    <CommentItemTemplate
      comment={comment}
      cleanText={cleanText}
      taggedIds={taggedIds}
      isDeleting={isDeleting}
      currentUserId={currentUserId}
      items={items}
      formatDate={formatDate}
      onItemTaggedClick={onItemTaggedClick}
      handleDeleteComment={handleDeleteComment}
      setDeletingCommentId={setDeletingCommentId}
    />
  );
};
