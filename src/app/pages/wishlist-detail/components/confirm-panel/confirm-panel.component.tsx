import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ConfirmPanelTemplate } from './confirm-panel.html';

export const ConfirmPanel: React.FC<Props> = ({
  message,
  tone = 'danger',
  yesLabel = 'Yes',
  noLabel = 'No',
  yesDisabled = false,
  onYes,
  onNo,
}) => {
  return (
    <ConfirmPanelTemplate
      message = {
        message
      }
      tone = {
        tone
      }
      yesLabel = {
        yesLabel
      }
      noLabel = {
        noLabel
      }
      yesDisabled = {
        yesDisabled
      }
      onYes = {
        onYes
      }
      onNo = {
        onNo
      }
    />
  );
};
