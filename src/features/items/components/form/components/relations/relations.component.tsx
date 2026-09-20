import React from 'react';
import type { Props } from './interfaces/props.interface';
import { RelationsTemplate } from './relations.html';

export const Relations: React.FC<Props> = (props) => {
  const {
    wishlistItems = [],
    itemId,
    readOnly = false,
    isMultiCount,
    isSuggestion,
    isSubstitutionSurface,
  } = props;

  const hasPeerItems = wishlistItems.some((item) => item.Id !== itemId);
  const showLinked =
    hasPeerItems && !readOnly && !isMultiCount && !isSuggestion && !isSubstitutionSurface;
  const showRelated = hasPeerItems && !readOnly && !isSubstitutionSurface;

  return (
    <RelationsTemplate
      {...props}
      showLinked = {
        showLinked
      }
      showRelated = {
        showRelated
      }
    />
  );
};
