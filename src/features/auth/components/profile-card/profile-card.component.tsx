import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getInitialsFromNames } from 'shared/utils/get-initials.util';
import { useAuth } from 'app/providers/auth-context';
import { ProfileCardTemplate } from './profile-card.html';
import { ImageCropper } from '../image-cropper/image-cropper.component';

export const ProfileCard: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.Username || '');
      setFirstName(user.FirstName || '');
      setLastName(user.LastName || '');
      setBio(user.Bio || '');
      setAvatar(user.Avatar || null);
    }
  }, [user]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username || !firstName || !lastName) {
      setErrorMsg('First Name, Last Name, and Username are required.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateProfile(username, firstName, lastName, bio, user?.Theme || 'default', avatar);
      setSuccessMsg('Profile settings updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'svg'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      const isAllowedMimeType = file.type.startsWith('image/') && (
        file.type.includes('png') ||
        file.type.includes('jpeg') ||
        file.type.includes('jpg') ||
        file.type.includes('svg+xml')
      );

      if (!allowedExtensions.includes(fileExtension) && !isAllowedMimeType) {
        setErrorMsg('Invalid file format. Only PNG, JPG, and SVG images are supported.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image size must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropperSrc(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const randomizeAvatarColor = () => {
    if (avatar && !avatar.startsWith('hsl')) {
      const confirm = window.confirm(
        'This will replace your custom profile picture with a randomized color. Are you sure you want to proceed?'
      );
      if (!confirm) return;
    }
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40) + 60; // 60-100%
    const l = Math.floor(Math.random() * 20) + 35; // 35-55%
    const color = `hsl(${h}, ${s}%, ${l}%)`;
    setAvatar(color);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.')) {
      alert('Delete Account requested. Contact your system administrator to finalize.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const initials = useMemo(
    () => getInitialsFromNames(firstName, lastName),
    [firstName, lastName]
  );

  const isImageAvatar = !!(avatar && !avatar.startsWith('hsl'));

  const avatarStyle = useMemo((): React.CSSProperties => {
    if (isImageAvatar && avatar) {
      return {
        backgroundImage: `url(${avatar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (avatar && avatar.startsWith('hsl')) {
      return { backgroundColor: avatar };
    }
    return { backgroundColor: 'var(--primary)' };
  }, [avatar, isImageAvatar]);

  if (!user) return null;

  return (
    <>
      <ProfileCardTemplate
        user={user}
        username={username}
        setUsername={setUsername}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        bio={bio}
        setBio={setBio}
        avatar={avatar}
        setAvatar={setAvatar}
        isLoading={isLoading}
        errorMsg={errorMsg}
        successMsg={successMsg}
        handleSubmit={handleSubmit}
        handleAvatarChange={handleAvatarChange}
        handleRemoveAvatar={handleRemoveAvatar}
        randomizeAvatarColor={randomizeAvatarColor}
        handleDeleteAccount={handleDeleteAccount}
        fileInputRef={fileInputRef}
        handleUploadClick={handleUploadClick}
        initials={initials}
        isImageAvatar={isImageAvatar}
        avatarStyle={avatarStyle}
      />
      {cropperSrc && (
        <ImageCropper
          imageSrc={cropperSrc}
          onCrop={(cropped) => {
            setAvatar(cropped);
            setCropperSrc(null);
          }}
          onCancel={() => setCropperSrc(null)}
        />
      )}
    </>
  );
};
