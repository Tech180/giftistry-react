import React from 'react';
import { Link2, Layers2 } from 'lucide-react';
import { SubstitutionBadge } from '../../../../../item-presentation';
import type { Props } from './interfaces/props.interface';

export const ContentTemplate: React.FC<Props> = ({
  name,
  isLinkedToItems,
  isRelatedToItems,
  showSubstitutionBadge,
  substitutionKind,
  substitutionCreatedByUserId,
  linkedIconClassName,
}) => {
  return (
    <>
      {isLinkedToItems ? (
        <Link2 size={16} className={linkedIconClassName} aria-hidden="true" />
      ) : null}
      {isRelatedToItems ? (
        <Layers2
          size={16}
          className={linkedIconClassName}
          aria-label="Related to other items"
        />
      ) : null}
      {name}
      {showSubstitutionBadge ? (
        <SubstitutionBadge
          kind = {
            substitutionKind
          }
          createdByUserId = {
            substitutionCreatedByUserId
          }
        />
      ) : null}
    </>
  );
};
