import React from 'react';
import { EnterPanel, AiStatusBadge } from 'shared/ui';
import { Check, AlertCircle, Dices, Upload, Eye, EyeOff, X } from 'lucide-react';
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
  handleAvatarColorChange,
  avatarPickerHex,
  randomizeAvatarColor,
  isServerOwner,
  handleDisableAccount,
  handleDeleteAccount,
  showDeleteModal,
  deletePassword,
  setDeletePassword,
  showDeletePassword,
  setShowDeletePassword,
  deleteError,
  isAccountActionLoading,
  onCloseDeleteModal,
  onConfirmDeleteAccount,
  fileInputRef,
  handleUploadClick,
  initials,
  isImageAvatar,
  avatarStyle,
  showAiBadge,
  aiEnabled,
  isAiSaving,
  onAiToggle,
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

          <div className={styles['avatar-color-picker']}>
            <label className={styles['avatar-color-label']} htmlFor="avatar-color-input">
              Avatar color
            </label>
            <div className={styles['avatar-color-control']}>
              <span className={styles['avatar-color-value']}>{avatarPickerHex.toUpperCase()}</span>
              <div className={styles['avatar-color-picker-wrapper']}>
                <input
                  id="avatar-color-input"
                  type="color"
                  value={avatarPickerHex}
                  onChange={(e) => handleAvatarColorChange(e.target.value)}
                  aria-label="Pick avatar color"
                />
              </div>
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

      {showAiBadge && (
        <section className={styles['ai-section']}>
          <div className={styles['ai-section-card']}>
            <div className={styles['ai-section-row']}>
              <div>
                <h3 className={styles['ai-section-title']}>AI Features</h3>
                <p className={styles['ai-section-desc']}>
                  Control whether AI-powered features are available on your account.
                </p>
              </div>
              <AiStatusBadge
                enabled={aiEnabled}
                onToggle={onAiToggle}
                disabled={isAiSaving}
                ariaLabelEnabled="AI features enabled on your account. Click to disable."
                ariaLabelDisabled="AI features disabled on your account. Click to enable."
              />
            </div>
          </div>
        </section>
      )}

      {/* Danger Zone Section */}
      {!isServerOwner && (
        <div className={styles['danger-zone-card']}>
          <h3 className={styles['danger-title']}>Danger Zone</h3>
          <p className={styles['danger-desc']}>
            Disabling your account blocks sign-in and makes your wishlists inaccessible. Deleting permanently removes your account and all associated data.
          </p>
          <div className={styles['danger-actions']}>
            <button
              type="button"
              onClick={handleDisableAccount}
              disabled={isAccountActionLoading}
              className={`${styles.btn} ${styles['btn-danger-outline']} ${styles['btn-md']}`}
            >
              Disable Account
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isAccountActionLoading}
              className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-md']}`}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles['delete-modal-overlay']} onClick={onCloseDeleteModal}>
          <div
            className={styles['delete-modal']}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="delete-account-title"
            aria-modal="true"
          >
            <div className={styles['delete-modal-header']}>
              <h3 id="delete-account-title" className={styles['delete-modal-title']}>Delete account</h3>
              <button
                type="button"
                className={styles['delete-modal-close']}
                onClick={onCloseDeleteModal}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <p className={styles['delete-modal-desc']}>
              This action is permanent and cannot be undone. All wishlists and profile data will be removed.
            </p>
            {deleteError && (
              <div className={`${styles.alert} ${styles['alert-error']} ${styles['delete-modal-error']}`}>
                <AlertCircle size={16} />
                <span>{deleteError}</span>
              </div>
            )}
            <div className={styles['input-container']}>
              <label className={styles['input-label']} htmlFor="delete-password">Password</label>
              <div className={styles['password-input-wrap']}>
                <input
                  id="delete-password"
                  type={showDeletePassword ? 'text' : 'password'}
                  className={styles['input-field']}
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles['password-toggle']}
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  aria-label={showDeletePassword ? 'Hide password' : 'Show password'}
                >
                  {showDeletePassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className={styles['delete-modal-actions']}>
              <button
                type="button"
                onClick={onCloseDeleteModal}
                disabled={isAccountActionLoading}
                className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-md']}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteAccount}
                disabled={isAccountActionLoading || !deletePassword}
                className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-md']}`}
              >
                {isAccountActionLoading ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </EnterPanel>
  );
};
