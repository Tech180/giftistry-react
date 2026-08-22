import React, { useState } from 'react';
import { allocateCustomPackId } from '../../utils/allocate-custom-pack-id.util';
import type { PackEditorDraft } from './interfaces/pack-editor-draft.interface';
import type { PackEditorPaneProps } from './interfaces/pack-editor-pane-props.interface';
import { PackEditorPaneTemplate } from './pack-editor-pane.html';
import {
  emptyPackEditorField,
  toCustomPackSettingsFromDraft,
  toPackEditorDraft,
} from './utils/pack-editor-draft.util';
import { validateCustomPackSettings } from './utils/validate-custom-pack-settings.util';

export const PackEditorPane: React.FC<PackEditorPaneProps> = ({
  mode,
  initialPack,
  takenIds,
  disabled,
  onCancel,
  onApply,
  onDelete,
}) => {
  const [draft, setDraft] = useState<PackEditorDraft>(() => toPackEditorDraft(initialPack));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateDraft = (patch: Partial<PackEditorDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const handleApply = () => {
    const packId =
      mode === 'create' ? allocateCustomPackId(draft.label, new Set(takenIds)) : initialPack.Id;
    const next = toCustomPackSettingsFromDraft(draft, packId);
    const error = validateCustomPackSettings(next);
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage(null);
    onApply(next);
  };

  return (
    <PackEditorPaneTemplate
      mode={mode}
      draft={draft}
      heading={mode === 'create' ? 'Create pack' : `Edit ${initialPack.Label}`}
      errorMessage={errorMessage}
      disabled={disabled}
      canDelete={mode === 'edit' && Boolean(onDelete)}
      onBack={onCancel}
      onLabelChange={(value) => updateDraft({ label: value })}
      onDescriptionChange={(value) => updateDraft({ description: value })}
      onCategoriesChange={(value) => updateDraft({ categoriesText: value })}
      onTitleKeywordsChange={(value) => updateDraft({ titleKeywordsText: value })}
      onPromptFragmentChange={(value) => updateDraft({ promptFragment: value })}
      onFieldKeyChange={(index, value) => {
        setDraft((current) => ({
          ...current,
          fields: current.fields.map((field, fieldIndex) =>
            fieldIndex === index ? { ...field, key: value } : field
          ),
        }));
      }}
      onFieldLabelChange={(index, value) => {
        setDraft((current) => ({
          ...current,
          fields: current.fields.map((field, fieldIndex) =>
            fieldIndex === index ? { ...field, label: value } : field
          ),
        }));
      }}
      onFieldBucketChange={(index, value) => {
        setDraft((current) => ({
          ...current,
          fields: current.fields.map((field, fieldIndex) =>
            fieldIndex === index ? { ...field, bucket: value } : field
          ),
        }));
      }}
      onFieldHintChange={(index, value) => {
        setDraft((current) => ({
          ...current,
          fields: current.fields.map((field, fieldIndex) =>
            fieldIndex === index ? { ...field, hint: value } : field
          ),
        }));
      }}
      onRemoveField={(index) => {
        setDraft((current) => ({
          ...current,
          fields: current.fields.filter((_, fieldIndex) => fieldIndex !== index),
        }));
      }}
      onAddField={() => {
        setDraft((current) => ({
          ...current,
          fields: [...current.fields, emptyPackEditorField()],
        }));
      }}
      onApply={handleApply}
      onDelete={() => onDelete?.()}
    />
  );
};
