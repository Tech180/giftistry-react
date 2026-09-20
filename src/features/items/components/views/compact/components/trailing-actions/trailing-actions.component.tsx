import React from 'react';
import type { Props } from './interfaces/props.interface';
import { TrailingActionsTemplate } from './trailing-actions.html';
import styles from '../../view.module.css';

export const TrailingActions: React.FC<Props> = ({
  reserveTrailing,
  substitutionAction = null,
  trailingClassName,
  actionBtnClassName,
  actionBtnClaimClassName,
  actionBtnClaimDangerClassName,
  ...rest
}) => {
  if (!reserveTrailing) {
    return null;
  }

  return (
    <TrailingActionsTemplate
      {...rest}
      substitutionAction = {
        substitutionAction
      }
      trailingClassName = {
        trailingClassName
      }
      linkClassName = {
        styles['view__link']
      }
      actionBtnClassName = {
        actionBtnClassName
      }
      actionBtnClaimClassName = {
        actionBtnClaimClassName
      }
      actionBtnClaimDangerClassName = {
        actionBtnClaimDangerClassName
      }
      actionIconClassName = {
        styles['view__action-icon']
      }
    />
  );
};
