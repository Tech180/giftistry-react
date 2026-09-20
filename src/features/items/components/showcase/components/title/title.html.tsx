import React from 'react';
import { Content } from './components/content/content.component';
import type { TemplateProps } from './interfaces/template-props.interface';

export const TitleTemplate: React.FC<TemplateProps> = ({
  variant,
  name,
  isLinkedToItems,
  isRelatedToItems,
  showSubstitutionBadge,
  substitutionKind,
  substitutionCreatedByUserId,
  titleClassName,
  linkedIconClassName,
}) => {
  if (variant === 'inline') {
    return (
      <h2 className={titleClassName}>
        <Content
          name = {
            name
          }
          isLinkedToItems = {
            isLinkedToItems
          }
          isRelatedToItems = {
            isRelatedToItems
          }
          showSubstitutionBadge = {
            showSubstitutionBadge
          }
          substitutionKind = {
            substitutionKind
          }
          substitutionCreatedByUserId = {
            substitutionCreatedByUserId
          }
          linkedIconClassName = {
            linkedIconClassName
          }
        />
      </h2>
    );
  }

  return (
    <h3 className={titleClassName}>
      <Content
        name = {
          name
        }
        isLinkedToItems = {
          isLinkedToItems
        }
        isRelatedToItems = {
          isRelatedToItems
        }
        showSubstitutionBadge = {
          showSubstitutionBadge
        }
        substitutionKind = {
          substitutionKind
        }
        substitutionCreatedByUserId = {
          substitutionCreatedByUserId
        }
        linkedIconClassName = {
          linkedIconClassName
        }
      />
    </h3>
  );
};
