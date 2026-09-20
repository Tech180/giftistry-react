import React from 'react';
import { SubstitutionClaimButton } from '../../../../../item-presentation';
import type { Props } from './interfaces/props.interface';

export const SubstitutionSlotTemplate: React.FC<Props> = ({
  substitutionAction,
  claimLoading,
  substitutionManageIconClassName,
}) => {
  if (!substitutionAction) {
    return null;
  }

  return (
    <SubstitutionClaimButton
      mode = {
        substitutionAction.mode
      }
      allowSubstitutions = {
        substitutionAction.allowSubstitutions
      }
      onOpenEditor = {
        substitutionAction.onRequest
      }
      onDelete = {
        substitutionAction.onDelete
      }
      appearance = {
        'ghost-text'
      }
      disabled = {
        claimLoading
      }
      className = {
        substitutionManageIconClassName
      }
    />
  );
};
