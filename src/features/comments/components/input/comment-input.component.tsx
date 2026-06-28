import React from 'react';
import { CommentInputProps } from '../../interfaces/comment-input-props.interface';
import { CommentInputTemplate } from './comment-input.html';

export const CommentInput: React.FC<CommentInputProps> = (props) => {
  return <CommentInputTemplate {...props} />;
};
