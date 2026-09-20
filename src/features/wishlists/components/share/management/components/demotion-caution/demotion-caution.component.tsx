import React from 'react';
import { getInitialsFromDisplayName } from 'shared/utils/get-initials.util';
import type { Props } from './interfaces/props.interface';
import { DemotionCautionTemplate } from './demotion-caution.html';

export const DemotionCaution: React.FC<Props> = ({
  title,
  description,
  proceedPrompt,
  displayName,
  username,
  avatar,
  error,
  isConfirming,
  onConfirm,
  onCancel,
}) => {
  const initials = displayName ? getInitialsFromDisplayName(displayName) : '?';

  return (
    <DemotionCautionTemplate
      title = {
        title
      }
      description = {
        description
      }
      proceedPrompt = {
        proceedPrompt
      }
      displayName = {
        displayName
      }
      username = {
        username
      }
      avatar = {
        avatar
      }
      error = {
        error
      }
      isConfirming = {
        isConfirming
      }
      onConfirm = {
        onConfirm
      }
      onCancel = {
        onCancel
      }
      initials = {
        initials || displayName?.[0]?.toUpperCase() || '?'
      }
    />
  );
};
