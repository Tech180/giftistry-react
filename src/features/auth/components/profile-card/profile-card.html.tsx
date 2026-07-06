import React from 'react';
import { EnterPanel } from 'shared/ui';
import { Check, AlertCircle, Dices, Upload } from 'lucide-react';
import { ProfileCardTemplateProps } from '../../interfaces/profile-card-template-props.interface';
import styles from './profile-card.module.css';

export const ProfileCardTemplate: React.FC<ProfileCardTemplateProps> = ({
  user,
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  avatar,
  isLoading,
  hasChanges,
  errorMsg,
  successMsg,
  handleSubmit,
  handleAvatarChange,
  randomizeAvatarColor,
  handleDeleteAccount,
  fileInputRef,
  handleUploadClick,
  initials,
  isImageAvatar,
  avatarStyle,
}) => {
  return (
    <EnterPanel animation="fade" className={styles.container}>
      <div className={styles['page-header']}>
        <h2 className={styles['page-title']}>Account Settings</h2>
        <p className={styles['page-subtitle']}>Manage your personal information and public presence.</p>
      </div>

      {errorMsg && (
        <EnterPanel animation="slide-up" className={`${styles.alert} ${styles['alert-error']}`}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </EnterPanel>
      )}

      {successMsg && (
        <EnterPanel animation="slide-up" className={`${styles.alert} ${styles['alert-success']}`}>
          <Check size={16} />
          <span>{successMsg}</span>
        </EnterPanel>
      )}

      <div className={styles['flex-layout']}>
        {/* Left Column: Avatar & Controls */}
        <div className={styles['avatar-column']}>
          <div className={styles['avatar-wrapper']}>
            <div className={styles['avatar-preview']}>
              <div className={styles['avatar-media']} key={avatar ?? 'default'} style={avatarStyle}>
                {!isImageAvatar && <span className={styles['avatar-initials']}>{initials}</span>}
              </div>
              <button
                type="button"
                className={`${styles['avatar-action']} ${styles['avatar-action-left']}`}
                onClick={randomizeAvatarColor}
                title="Randomize color"
                aria-label="Randomize color"
              >
                <Dices size={14} />
              </button>
              <button
                type="button"
                className={`${styles['avatar-action']} ${styles['avatar-action-right']}`}
                onClick={handleUploadClick}
                title="Upload profile picture"
                aria-label="Upload profile picture"
              >
                <Upload size={14} />
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        {/* Right Column: Information Form */}
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
                value={user.Email}
                disabled
                title="Contact support to change email"
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
      </div>

      {/* Danger Zone Section */}
      <div className={styles['danger-zone-card']}>
        <h3 className={styles['danger-title']}>Danger Zone</h3>
        <p className={styles['danger-desc']}>
          Once you delete your account, all wishlists and profile details will be permanently removed.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-md']}`}
        >
          Delete Account
        </button>
      </div>
    </EnterPanel>
  );
};
