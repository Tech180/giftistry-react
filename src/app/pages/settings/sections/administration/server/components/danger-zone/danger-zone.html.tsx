import React from 'react';
import { Button, Switch } from 'shared/ui';
import { SettingGroup, SettingItem } from '../../../components';
import type { Props } from './interfaces/props.interface';
import styles from './danger-zone.module.css';

export const DangerZoneTemplate: React.FC<Props> = ({
  allowSetup,
  onAllowSetupChange,
  isSavingAllowSetup,
  onDeleteServer,
  isDeletingServer,
}) => (
  <section className={styles['danger-zone']}>
    <h2 className={styles['danger-zone__title']}>Danger zone</h2>
    <p className={styles['danger-zone__desc']}>
      Controls that can reopen first-run setup or permanently erase this instance.
    </p>

    <SettingGroup className={styles['danger-zone__group']}>
      <SettingItem
        title="Allow first-run setup"
        description="When enabled, the setup wizard is available if this instance has no users (for example after Delete server). After a successful setup it seals again automatically."
      >
        <Switch
          checked={allowSetup}
          onChange={onAllowSetupChange}
          disabled={isSavingAllowSetup}
          aria-label="Allow first-run setup"
        />
      </SettingItem>

      <SettingItem
        title="Delete server"
        description="Permanently delete this Giftistry instance and all user data."
      >
        <Button
          variant="danger"
          size="sm"
          onClick={onDeleteServer}
          isLoading={isDeletingServer}
        >
          Delete server
        </Button>
      </SettingItem>
    </SettingGroup>
  </section>
);
