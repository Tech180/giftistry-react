import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, Input } from 'shared/ui';
import { PromptCodeEditor } from '../../../prompt-code-editor/prompt-code-editor.component';
import { PackFieldEditor } from '../pack-field-editor/pack-field-editor.component';
import { WorkspaceViewHeader } from '../workspace-view-header/workspace-view-header.component';
import type { PackEditorPaneTemplateProps } from './interfaces/pack-editor-pane-template-props.interface';
import styles from './pack-editor-pane.module.css';

export const PackEditorPaneTemplate: React.FC<PackEditorPaneTemplateProps> = ({
  mode,
  draft,
  heading,
  errorMessage,
  disabled,
  canDelete,
  onBack,
  onLabelChange,
  onDescriptionChange,
  onCategoriesChange,
  onTitleKeywordsChange,
  onPromptFragmentChange,
  onFieldKeyChange,
  onFieldLabelChange,
  onFieldBucketChange,
  onFieldHintChange,
  onRemoveField,
  onAddField,
  onApply,
  onDelete,
}) => {
  return (
    <>
      <WorkspaceViewHeader
        heading={heading}
        leading={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            className={styles['header-icon-btn']}
            leftIcon={<ArrowLeft size={18} />}
            onClick={onBack}
            aria-label="Back to packs"
            title="Back to packs"
          />
        }
        actions={
          <div className={styles['header-actions']}>
            {canDelete && (
              <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={onBack}>
              Cancel
            </Button>
            <Button type="button" variant="primary" size="sm" disabled={disabled} onClick={onApply}>
              {mode === 'create' ? 'Add pack' : 'Apply changes'}
            </Button>
          </div>
        }
      />

      <div className={styles.body}>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.section}>
          <Input
            label="Label"
            value={draft.label}
            disabled={disabled}
            onChange={(event) => onLabelChange(event.target.value)}
          />
          {draft.id ? <p className={styles.hint}>Id: {draft.id}</p> : null}
          <Input
            label="Description"
            value={draft.description}
            disabled={disabled}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </div>

        <div className={styles.section}>
          <h4 className={styles.label}>When this pack applies</h4>
          <p className={styles.hint}>
            Leave both empty to apply whenever the pack is enabled. Add categories or title keywords
            to narrow matching.
          </p>
          <Input
            label="Categories"
            value={draft.categoriesText}
            disabled={disabled}
            placeholder="books, media"
            onChange={(event) => onCategoriesChange(event.target.value)}
          />
          <Input
            label="Title keywords"
            value={draft.titleKeywordsText}
            disabled={disabled}
            placeholder="hardcover, isbn"
            onChange={(event) => onTitleKeywordsChange(event.target.value)}
          />
        </div>

        <div className={styles.section}>
          <div className={styles['section-heading']}>
            <h4 className={styles.label}>Extracted fields</h4>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles['add-field-btn']}
              disabled={disabled}
              onClick={onAddField}
            >
              Add field
            </Button>
          </div>
          {draft.fields.map((field, index) => (
            <PackFieldEditor
              key={index}
              field={field}
              disabled={disabled}
              onKeyChange={(value) => onFieldKeyChange(index, value)}
              onLabelChange={(value) => onFieldLabelChange(index, value)}
              onBucketChange={(value) => onFieldBucketChange(index, value)}
              onHintChange={(value) => onFieldHintChange(index, value)}
              onRemove={() => onRemoveField(index)}
            />
          ))}
        </div>

        <div className={styles.section}>
          <h4 className={styles.label}>Prompt fragment</h4>
          <p className={styles.hint}>Appended to the Populate prompt when this pack is matched.</p>
          <PromptCodeEditor
            value={draft.promptFragment}
            onChange={onPromptFragmentChange}
            readOnly={disabled}
            aria-label={`${heading} prompt fragment editor`}
          />
        </div>
      </div>
    </>
  );
};
