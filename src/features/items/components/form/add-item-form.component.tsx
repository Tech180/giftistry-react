import React, { useState, useEffect } from 'react';
import { itemsApi } from '../../api/items.api';
import { Priority, wishlistsApi } from 'features/wishlists';
import { AddItemFormProps } from '../../interfaces/add-item-form-props.interface';
import { AddItemFormTemplate } from './add-item-form.html';

export const AddItemForm: React.FC<AddItemFormProps> = ({ listId, isOwner, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [isHiddenIdea, setIsHiddenIdea] = useState(false);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const data = await wishlistsApi.listPriorities();
        setPriorities(data || []);
      } catch (err) {
        // Fallback silently if priority fetch fails
      }
    };
    fetchPriorities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter an item name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await itemsApi.addItem(
        listId,
        name.trim(),
        description.trim() || null,
        priorityId || null,
        isOwner ? false : isHiddenIdea
      );
      setName('');
      setDescription('');
      setPriorityId('');
      setIsHiddenIdea(false);
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AddItemFormTemplate
      name={name}
      setName={setName}
      description={description}
      setDescription={setDescription}
      priorityId={priorityId}
      setPriorityId={setPriorityId}
      isHiddenIdea={isHiddenIdea}
      setIsHiddenIdea={setIsHiddenIdea}
      priorities={priorities}
      isOwner={isOwner}
      isLoading={isLoading}
      errorMsg={errorMsg}
      handleSubmit={handleSubmit}
    />
  );
};
