import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitialsFromNames } from 'shared/utils/get-initials.util';
import {
  avatarColorToHex,
  generateAvatarColor,
  getAvatarStyle,
  hexToHsl,
  isAvatarImage,
} from 'shared/utils/avatar.util';
import { useAuth } from 'app/providers/auth-context';
import { authApi } from '../../api/auth.api';
import { ApiError } from 'core/api/client';
import { ProfileCardTemplate } from './profile-card.html';
import { ImageCropper } from '../image-cropper/image-cropper.component';

export const ProfileCard: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isAccountActionLoading, setIsAccountActionLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsername(user.Username || '');
    setFirstName(user.FirstName || '');
    setLastName(user.LastName || '');
    setBio(user.Bio || '');
    setAvatar(user.Avatar ?? null);
  }, [user?.Id]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      username !== (user.Username || '') ||
      firstName !== (user.FirstName || '') ||
      lastName !== (user.LastName || '') ||
      bio !== (user.Bio || '') ||
      avatar !== (user.Avatar ?? null)
    );
  }, [user, username, firstName, lastName, bio, avatar]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!hasChanges) return;
    if (!username || !firstName || !lastName) {
      setErrorMsg('First Name, Last Name, and Username are required.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const updatedUser = await updateProfile(username, firstName, lastName, bio, user?.Theme || 'default', avatar);
      if (updatedUser) {
        setAvatar(updatedUser.Avatar ?? null);
      }
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

  const randomizeAvatarColor = () => {
    if (isAvatarImage(avatar)) {
      const confirm = window.confirm(
        'This will replace your custom profile picture with a randomized color. Are you sure you want to proceed?'
      );
      if (!confirm) return;
    }
    setAvatar(generateAvatarColor());
  };

  const handleAvatarColorChange = (hex: string) => {
    if (isAvatarImage(avatar)) {
      const confirm = window.confirm(
        'This will replace your custom profile picture with the selected color. Are you sure you want to proceed?'
      );
      if (!confirm) return;
    }
    setAvatar(hexToHsl(hex));
  };

  const handleDisableAccount = async () => {
    const confirmed = window.confirm(
      'Disable your account? You will be signed out immediately and will not be able to log in again. Your wishlists will become inaccessible to others until an administrator re-enables your account.'
    );
    if (!confirmed) return;

    setIsAccountActionLoading(true);
    setErrorMsg(null);
    try {
      await authApi.disableAccount();
      await logout();
      navigate('/login');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to disable account.');
    } finally {
      setIsAccountActionLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeletePassword('');
    setDeleteError(null);
    setShowDeletePassword(false);
    setShowDeleteModal(true);
  };

  const onCloseDeleteModal = () => {
    if (isAccountActionLoading) return;
    setShowDeleteModal(false);
    setDeletePassword('');
    setDeleteError(null);
  };

  const onConfirmDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError('Please enter your password.');
      return;
    }

    setIsAccountActionLoading(true);
    setDeleteError(null);
    try {
      await authApi.deleteAccount(deletePassword);
      await logout();
      navigate('/login');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setDeleteError('Incorrect password.');
      } else {
        setDeleteError(err instanceof Error ? err.message : 'Failed to delete account.');
      }
    } finally {
      setIsAccountActionLoading(false);
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

  const isImageAvatar = isAvatarImage(avatar);

  const avatarStyle = useMemo(() => getAvatarStyle(avatar), [avatar]);
  const avatarPickerHex = useMemo(() => avatarColorToHex(avatar), [avatar]);

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
        hasChanges={hasChanges}
        errorMsg={errorMsg}
        successMsg={successMsg}
        handleSubmit={handleSubmit}
        handleAvatarChange={handleAvatarChange}
        handleAvatarColorChange={handleAvatarColorChange}
        avatarPickerHex={avatarPickerHex}
        randomizeAvatarColor={randomizeAvatarColor}
        isServerOwner={!!user.IsOwner}
        handleDisableAccount={handleDisableAccount}
        handleDeleteAccount={handleDeleteAccount}
        showDeleteModal={showDeleteModal}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        showDeletePassword={showDeletePassword}
        setShowDeletePassword={setShowDeletePassword}
        deleteError={deleteError}
        isAccountActionLoading={isAccountActionLoading}
        onCloseDeleteModal={onCloseDeleteModal}
        onConfirmDeleteAccount={onConfirmDeleteAccount}
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
