import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ClaimSectionTemplate } from './claim-section.html';
import styles from '../../view.module.css';

export const ClaimSection: React.FC<Props> = (props) => {
  if (
    !props.showClaimFormWithActions &&
    !props.showClaimFormPrompt &&
    !props.showDeleteConfirmPanel
  ) {
    return null;
  }

  return (
    <ClaimSectionTemplate
      {...props}
      confirmExtensionClassName = {
        styles['view__confirm-extension']
      }
      confirmPromptClassName = {
        styles['view__confirm-prompt']
      }
      confirmLinkedTagsClassName = {
        styles['view__confirm-linked-tags']
      }
    />
  );
};
