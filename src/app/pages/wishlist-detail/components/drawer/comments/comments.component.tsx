import React, { useState } from 'react';
import { CommentsProps } from './interfaces/comments-props.interface';
import { CommentsTemplate } from './comments.html';

export const Comments: React.FC<CommentsProps> = (props) => {
  const [showDeletedComments, setShowDeletedComments] = useState(false);

  return (
    <CommentsTemplate
      {...props}
      showDeletedComments={showDeletedComments}
      onToggleShowDeletedComments={() => setShowDeletedComments((prev) => !prev)}
    />
  );
};
