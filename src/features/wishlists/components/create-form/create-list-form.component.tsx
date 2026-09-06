import React, { useEffect, useState } from 'react';
import { wishlistsApi } from '../../api/wishlists.api';
import { CreateListFormProps } from '../../interfaces/create-list-form-props.interface';
import { CreateListFormTemplate } from './create-list-form.html';
import { useAuth } from 'app/providers/auth-context';
import { dateInputToExpiresAtIso } from '../../utils/date-input-to-expires-at-iso.util';

export const CreateListForm: React.FC<CreateListFormProps> = ({ onSuccess, onCancel }) => {
  const { canShowAi, canShowWebSearch } = useAuth();

  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [allowGroupFunds, setAllowGroupFunds] = useState(true);
  const [category, setCategory] = useState('generic');
  const [customCategory, setCustomCategory] = useState('');
  const [aiEnabled, setAiEnabled] = useState(canShowAi);
  const [webSearchEnabled, setWebSearchEnabled] = useState(canShowWebSearch);
  const [autoRollover, setAutoRollover] = useState(true);

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
        dateInputToExpiresAtIso(expiresAt),
        allowGroupFunds,
        finalCategory,
        undefined,
        aiEnabled,
        webSearchEnabled,
        true,
        autoRollover
      );
      setTitle('');
      setExpiresAt('');
      setAllowGroupFunds(true);
      setCategory('generic');
      setCustomCategory('');
      setAiEnabled(canShowAi);
      setWebSearchEnabled(canShowWebSearch);
      setAutoRollover(true);
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
      category={category}
      setCategory={setCategory}
      customCategory={customCategory}
      setCustomCategory={setCustomCategory}
      aiEnabled={aiEnabled}
      setAiEnabled={handleAiEnabledChange}
      webSearchEnabled={webSearchEnabled}
      setWebSearchEnabled={setWebSearchEnabled}
      autoRollover={autoRollover}
      setAutoRollover={setAutoRollover}
      globalAiEnabled={canShowAi}
      globalWebSearchEnabled={canShowWebSearch}
      onCancel={onCancel}
    />
  );
};
