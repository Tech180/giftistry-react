import React, { useRef } from 'react';
import { Check, AlertCircle, Dices, Upload, Trash2 } from 'lucide-react';
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
  errorMsg,
  successMsg,
  handleSubmit,
  handleAvatarChange,
  handleRemoveAvatar,
  randomizeAvatarColor,
  handleDeleteAccount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    const f = firstName.trim();
    const l = lastName.trim();
    return (f.charAt(0) + l.charAt(0)).toUpperCase() || 'U';
  };

  // Determine avatar background style and whether it's an image
  const isImageAvatar = avatar && !avatar.startsWith('hsl');
  
  const avatarStyle: React.CSSProperties = {};
  if (isImageAvatar) {
    avatarStyle.backgroundImage = `url(${avatar})`;
    avatarStyle.backgroundSize = 'cover';
    avatarStyle.backgroundPosition = 'center';
  } else if (avatar && avatar.startsWith('hsl')) {
    avatarStyle.backgroundColor = avatar;
  } else {
    // Default fallback color
    avatarStyle.backgroundColor = 'var(--primary)';
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Profile Settings</h2>
        <p className={styles.pageSubtitle}>Manage your personal information and public presence.</p>
      </div>

      {errorMsg && (
        <div className={`${styles.alert} ${styles.alertError} animate-slide-up`}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className={`${styles.alert} ${styles.alertSuccess} animate-slide-up`}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className={styles.flexLayout}>
        {/* Left Column: Avatar & Controls */}
        <div className={styles.avatarColumn}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarPreview} style={avatarStyle}>
              {!isImageAvatar && <span className={styles.avatarInitials}>{getInitials()}</span>}
            </div>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div className={styles.avatarButtons}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
              onClick={handleUploadClick}
              title="Upload Profile Picture"
            >
              <Upload size={14} /> Upload Picture
            </button>
            
            <button
              type="button"
              className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
              onClick={randomizeAvatarColor}
              title="Randomize Initials Background Color"
            >
              <Dices size={14} /> Randomize Color
            </button>

            {isImageAvatar && (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDangerOutline} ${styles.btnSm}`}
                onClick={handleRemoveAvatar}
                title="Remove Custom Picture"
              >
                <Trash2 size={14} /> Remove Picture
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Information Form */}
        <div className={styles.formColumn}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.nameRow}>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>First Name</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Last Name</label>
                <input
                  type="text"
                  className={styles.inputField}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Username</label>
              <input
                type="text"
                className={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Email Address</label>
              <input
                type="email"
                className={styles.inputField}
                value={user.Email}
                disabled
                title="Contact support to change email"
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.bioLabelRow}>
                <label className={styles.inputLabel}>Biography</label>
                <span className={styles.charCount}>{bio.length} / 200</span>
              </div>
              <textarea
                className={styles.textareaField}
                rows={4}
                maxLength={200}
                placeholder="Write a short bio about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnMd}`}
              >
                {isLoading && <span className={styles.spinner}></span>}
                {isLoading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className={styles.dangerZoneCard}>
        <h3 className={styles.dangerTitle}>Danger Zone</h3>
        <p className={styles.dangerDesc}>
          Once you delete your account, all wishlists and profile details will be permanently removed.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className={`${styles.btn} ${styles.btnDanger} ${styles.btnMd}`}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
