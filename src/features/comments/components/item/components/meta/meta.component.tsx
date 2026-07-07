import React from 'react';
import { MetaProps } from './interfaces/meta-props.interface';
import { MetaTemplate } from './meta.html';
import { formatCommentDateBadge } from 'shared/utils/format-date.util';

export const Meta: React.FC<MetaProps> = (props) => {
  const { date: datePart, time: timePart } = formatCommentDateBadge(props.comment.CreatedAt);

  return (
    <MetaTemplate
      {...props}
      datePart={datePart}
      timePart={timePart}
    />
  );
};
