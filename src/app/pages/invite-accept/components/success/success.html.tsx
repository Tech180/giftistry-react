import React from 'react';
import { Button } from 'shared/ui';
import type { SuccessTemplateProps } from './interfaces/success-template-props.interface';
import styles from './success.module.css';

export const SuccessTemplate: React.FC<SuccessTemplateProps> = ({
  listId,
  onViewWishlist,
  onGoHome,
}) => (
  <div className={styles['success__card']}>
    <h1 className={styles['success__title']}>Invite Accepted!</h1>
    <p className={styles['success__message']}>You now have access to this wishlist.</p>
    <div className={styles['success__actions']}>
      {listId ? (
        <Button variant="primary" onClick={onViewWishlist}>
          View Wishlist
        </Button>
      ) : null}
      <Button variant="secondary" onClick={onGoHome}>
        Go to Dashboard
      </Button>
    </div>
  </div>
);
