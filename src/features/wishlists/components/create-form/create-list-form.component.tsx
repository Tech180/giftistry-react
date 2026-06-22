import React, { useState } from 'react';
import { wishlistsApi } from '../../api/wishlists.api';
import { CreateListFormProps } from '../../interfaces/create-list-form-props.interface';
import { CreateListFormTemplate } from './create-list-form.html';

export const CreateListForm: React.FC<CreateListFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [allowGroupFunds, setAllowGroupFunds] = useState(false);
  const [revealSuggestions, setRevealSuggestions] = useState(true);
  const [category, setCategory] = useState('generic');
  const [customCategory, setCustomCategory] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a list title.');
      return;
    }

    if (category === 'custom' && !customCategory.trim()) {
      setErrorMsg('Please enter a custom category name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const finalCategory = category === 'custom' ? customCategory.trim() : category;

    try {
      const res = await wishlistsApi.createWishlist(
        title.trim(),
        expiresAt ? new Date(expiresAt).toISOString() : null,
        allowGroupFunds,
        finalCategory,
        revealSuggestions
      );
      setTitle('');
      setExpiresAt('');
      setAllowGroupFunds(false);
      setRevealSuggestions(true);
      setCategory('generic');
      setCustomCategory('');
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
      revealSuggestions={revealSuggestions}
      setRevealSuggestions={setRevealSuggestions}
      isLoading={isLoading}
      errorMsg={errorMsg}
      handleSubmit={handleSubmit}
      category={category}
      setCategory={setCategory}
      customCategory={customCategory}
      setCustomCategory={setCustomCategory}
    />
  );
};
