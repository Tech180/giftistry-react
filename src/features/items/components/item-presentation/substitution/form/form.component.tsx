import React, { useEffect, useState } from 'react';
import { Modal } from 'shared/ui';
import type { CreateSubstitutionPayload } from '../../../../interfaces/item-substitution.interface';
import type { SubstitutionFormProps } from './interfaces/substitution-form-props.interface';
import { SubstitutionFormTemplate } from './form.html';

export type { SubstitutionFormProps } from './interfaces/substitution-form-props.interface';

export const SubstitutionForm: React.FC<SubstitutionFormProps> = ({
  isOpen,
  onClose,
  title,
  initial,
  onSubmit,
  isLoading = false,
  errorMsg = null,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [price, setPrice] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.Name ?? '');
    setDescription(initial?.Description ?? '');
    setLinkUrl(initial?.LinkUrl ?? '');
    setPrice(
      initial?.Price != null && Number.isFinite(initial.Price) ? String(initial.Price) : ''
    );
    setWebsiteName(initial?.WebsiteName ?? '');
    setLocalError(null);
  }, [isOpen, initial]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setLocalError('Name is required.');
      return;
    }
    const payload: CreateSubstitutionPayload = {
      Name: trimmed,
      Description: description.trim() || null,
      LinkUrl: linkUrl.trim() || null,
      WebsiteName: websiteName.trim() || null,
      Price: price.trim() ? Number(price) : null,
    };
    setSubmitting(true);
    setLocalError(null);
    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to save substitution.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <SubstitutionFormTemplate
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        linkUrl={linkUrl}
        setLinkUrl={setLinkUrl}
        price={price}
        setPrice={setPrice}
        websiteName={websiteName}
        setWebsiteName={setWebsiteName}
        isLoading={isLoading || submitting}
        errorMsg={errorMsg ?? localError}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};
