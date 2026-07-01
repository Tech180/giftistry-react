import React, { useState } from 'react';
import { wishlistsApi } from '../../api/wishlists.api';
import { ShareFormProps } from '../../interfaces/share-form-props.interface';
import { ShareFormTemplate } from './share-form.html';
import { useAuth } from 'app/providers/auth-context';

export const ShareForm: React.FC<ShareFormProps> = ({ listId, onSuccess }) => {
  const { user } = useAuth();
  const isUnverified = user ? !user.EmailVerified : false;

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'collaborator'>('viewer');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isUnverified) {
      setErrorMsg('Please verify your email address to share wishlists.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Please enter an email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await wishlistsApi.shareWishlist(listId, email.trim(), role);
      setEmail('');
      setSuccessMsg(`Successfully shared as ${role}!`);
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to share wishlist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ShareFormTemplate
      email={email}
      setEmail={setEmail}
      role={role}
      setRole={setRole}
      isLoading={isLoading}
      errorMsg={errorMsg}
      successMsg={successMsg}
      handleSubmit={handleSubmit}
      isUnverified={isUnverified}
    />
  );
};
