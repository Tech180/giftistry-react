import React from 'react';
import { TagsProps } from './interfaces/tags-props.interface';
import { TagsTemplate } from './tags.html';

export const Tags: React.FC<TagsProps> = (props) => {
  return <TagsTemplate {...props} />;
};
