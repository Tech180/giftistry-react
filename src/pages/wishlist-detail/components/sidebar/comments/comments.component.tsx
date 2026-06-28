import React from 'react';
import { CommentsProps } from './interfaces/comments-props.interface';
import { CommentsTemplate } from './comments.html';

export const Comments: React.FC<CommentsProps> = (props) => {
  return <CommentsTemplate {...props} />;
};
