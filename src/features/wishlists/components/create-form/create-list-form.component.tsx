import React, { useEffect, useState } from 'react';
import { wishlistsApi } from '../../api/wishlists.api';
import { CreateListFormProps } from '../../interfaces/create-list-form-props.interface';
import { CreateListFormTemplate } from './create-list-form.html';
import { useAuth } from 'app/providers/auth-context';

export const CreateListForm: React.FC<CreateListFormProps> = ({ onSuccess }) => {
  const { user, canShowAi, canShowWebSearch } = useAuth();
  const isUnverified = user ? !user.EmailVerified : false;

  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [allowGroupFunds, setAllowGroupFunds] = useState(false);
  const [revealSuggestions, setRevealSuggestions] = useState(true);
  const [category, setCategory] = useState('generic');
  const [customCategory, setCustomCategory] = useState('');
  const [aiEnabled, setAiEnabled] = useState(canShowAi);
  const [webSearchEnabled, setWebSearchEnabled] = useState(canShowWebSearch);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setAiEnabled(canShowAi);
    setWebSearchEnabled(canShowWebSearch);
  }, [canShowAi, canShowWebSearch]);

  const handleAiEnabledChange = (enabled: boolean) => {
    setAiEnabled(enabled);
    if (!enabled) {
      setWebSearchEnabled(false);
    } else if (canShowWebSearch) {
      setWebSearchEnabled(true);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isUnverified) {
      setErrorMsg('Please verify your email address to create wishlists.');
      return;
    }

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
        revealSuggestions,
        aiEnabled,
        webSearchEnabled
      );
      setTitle('');
      setExpiresAt('');
      setAllowGroupFunds(false);
      setRevealSuggestions(true);
      setCategory('generic');
      setCustomCategory('');
      setAiEnabled(canShowAi);
      setWebSearchEnabled(canShowWebSearch);
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
      aiEnabled={aiEnabled}
      setAiEnabled={handleAiEnabledChange}
      webSearchEnabled={webSearchEnabled}
      setWebSearchEnabled={setWebSearchEnabled}
      globalAiEnabled={canShowAi}
      globalWebSearchEnabled={canShowWebSearch}
      isUnverified={isUnverified}
    />
  );
};
