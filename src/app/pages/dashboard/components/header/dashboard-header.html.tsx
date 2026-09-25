import React from 'react';
import { Plus, Upload } from 'lucide-react';
import { TOUR_TARGETS } from 'features/tour';
import { Button } from 'shared/ui';
import type { DashboardHeaderTemplateProps } from './interfaces/dashboard-header-template-props.interface';
import styles from './dashboard-header.module.css';

export const DashboardHeaderTemplate: React.FC<DashboardHeaderTemplateProps> = ({
  greeting,
  isImportOpen,
  canShowAi,
  onToggleImport,
  onOpenCreate,
}) => (
  <div className={styles['dashboard-header']}>
    <div>
      <h1 className={styles['dashboard-header__greeting']}>{greeting}</h1>
      <p className={styles['dashboard-header__subtitle']}>
        Manage your personal registries and collaborated wishlists
      </p>
    </div>
    <div className={styles['dashboard-header__actions']}>
      <span className={styles['dashboard-header__import-action']}>
        <Button
          variant="secondary"
          onClick={onToggleImport}
          aria-label="Import wishlist"
          aria-pressed={isImportOpen}
          effect={canShowAi ? 'rainbow' : 'none'}
          data-tour={TOUR_TARGETS.importWishlist}
        >
          <Upload size={16} />
        </Button>
      </span>
      <Button
        variant="primary"
        leftIcon={<Plus size={16} />}
        onClick={onOpenCreate}
        data-tour={TOUR_TARGETS.createWishlist}
      >
        New Wishlist
      </Button>
    </div>
  </div>
);
