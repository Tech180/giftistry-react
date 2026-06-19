import React from 'react';
import { CommentInputProps } from './comment-input.interface';
import { CommentInputTemplate } from './comment-input.html';

export const CommentInput: React.FC<CommentInputProps> = (props) => {
  return <CommentInputTemplate {...props} />;
};
