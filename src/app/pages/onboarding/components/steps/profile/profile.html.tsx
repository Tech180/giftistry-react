import React from 'react';
import { Input } from 'shared/ui';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { ProfileTemplateProps } from './interfaces/profile-template-props.interface';
import styles from './profile.module.css';

export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  firstName,
  lastName,
  bio,
  onFirstNameChange,
  onLastNameChange,
  onBioChange,
}) => (
  <div className={styles['profile']}>
    <StaggerItem>
      <div className={styles['profile__row']}>
        <Input
          label="First Name"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Jane"
          autoFocus
        />
        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Doe"
        />
      </div>
    </StaggerItem>
    <StaggerItem>
      <div className={styles['profile__label-row']}>
        <span className={styles['profile__label']}>Bio</span>
        <span className={styles['profile__optional']}>Optional</span>
      </div>
      <textarea
        className={styles['profile__textarea']}
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        placeholder="A brief description..."
      />
    </StaggerItem>
  </div>
);
