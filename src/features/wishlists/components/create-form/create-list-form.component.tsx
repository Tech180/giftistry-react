import React, { useState } from 'react';
import { wishlistsApi } from '../../api/wishlists.api';
import { CreateListFormProps } from '../../interfaces/create-list-form-props.interface';
import { CreateListFormTemplate } from './create-list-form.html';

export const CreateListForm: React.FC<CreateListFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [allowGroupFunds, setAllowGroupFunds] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a list title.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await wishlistsApi.createWishlist(
        title.trim(),
        expiresAt ? new Date(expiresAt).toISOString() : null,
        allowGroupFunds
      );
      setTitle('');
      setExpiresAt('');
      setAllowGroupFunds(false);
      onSuccess(res);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create wishlist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateListFormTemplate
      title={title}
      setTitle={setTitle}
      expiresAt={expiresAt}
      setExpiresAt={setExpiresAt}
      allowGroupFunds={allowGroupFunds}
      setAllowGroupFunds={setAllowGroupFunds}
      isLoading={isLoading}
      errorMsg={errorMsg}
      handleSubmit={handleSubmit}
    />
  );
};
