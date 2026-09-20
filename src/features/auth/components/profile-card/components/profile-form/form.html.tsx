import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './form.module.css';

export const FormTemplate: React.FC<TemplateProps> = ({
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  email,
  isLoading,
  hasChanges,
  handleSubmit,
}) => {
  return (
    <div className={styles['form-column']}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles['name-row']}>
          <div className={styles['input-container']}>
            <label className={styles['input-label']}>First Name</label>
            <input
              type="text"
              className={styles['input-field']}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className={styles['input-container']}>
            <label className={styles['input-label']}>Last Name</label>
            <input
              type="text"
              className={styles['input-field']}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles['input-container']}>
          <label className={styles['input-label']}>Username</label>
          <input
            type="text"
            className={styles['input-field']}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className={styles['input-container']}>
          <label className={styles['input-label']}>Email Address</label>
          <input
            type="email"
            className={styles['input-field']}
            value={email}
            disabled
            title={email ? 'Contact support to change email' : 'No email on this account'}
            placeholder="No email set"
          />
        </div>

        <div className={styles['input-container']}>
          <div className={styles['bio-label-row']}>
            <label className={styles['input-label']}>Biography</label>
            <span className={styles['char-count']}>{bio.length} / 200</span>
          </div>
          <textarea
            className={styles['textarea-field']}
            rows={4}
            maxLength={200}
            placeholder="Write a short bio about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className={styles['submit-row']}>
          <button
            type="submit"
            disabled={isLoading || !hasChanges}
            className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-md']}`}
          >
            {isLoading && <span className={styles.spinner}></span>}
            {isLoading ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
