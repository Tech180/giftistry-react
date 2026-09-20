import React from 'react';
import { Input, SelectMenu } from 'shared/ui';
import {
  SMTP_TRANSPORT_MENU_TITLE,
  SMTP_TRANSPORT_OPTIONS,
} from '../../../constants/smtp-transport-options.constant';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { MailTemplateProps } from './interfaces/mail-template-props.interface';
import styles from './mail.module.css';

export const MailTemplate: React.FC<MailTemplateProps> = ({
  smtpType,
  smtpHost,
  smtpPort,
  smtpFrom,
  onSmtpTypeChange,
  onSmtpHostChange,
  onSmtpPortChange,
  onSmtpFromChange,
}) => (
  <div className={styles['mail']}>
    <StaggerItem>
      <span className={styles['mail__label']}>Transport Protocol</span>
      <SelectMenu
        className={styles['mail__select']}
        value={smtpType}
        options={SMTP_TRANSPORT_OPTIONS}
        onChange={(next) => onSmtpTypeChange(next as 'local' | 'remote')}
        variant="field"
        menuTitle={SMTP_TRANSPORT_MENU_TITLE}
        aria-label="Transport Protocol"
      />
    </StaggerItem>

    {smtpType === 'remote' ? (
      <StaggerItem>
        <div className={styles['mail__remote']}>
          <div className={styles['mail__row']}>
            <div className={styles['mail__grow']}>
              <Input
                label="Host"
                value={smtpHost}
                onChange={(e) => onSmtpHostChange(e.target.value)}
                placeholder="smtp.resend.com"
              />
            </div>
            <Input
              label="Port"
              value={smtpPort}
              onChange={(e) => onSmtpPortChange(e.target.value)}
            />
          </div>
        </div>
      </StaggerItem>
    ) : null}

    <StaggerItem>
      <Input
        label="System Sender Address"
        type="email"
        value={smtpFrom}
        onChange={(e) => onSmtpFromChange(e.target.value)}
      />
    </StaggerItem>
  </div>
);
