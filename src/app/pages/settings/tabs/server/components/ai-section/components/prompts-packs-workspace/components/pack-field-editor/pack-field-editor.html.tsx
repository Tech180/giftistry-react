import React from 'react';
import { Button, Input } from 'shared/ui';
import type { PackFieldEditorProps } from './interfaces/pack-field-editor-props.interface';
import styles from './pack-field-editor.module.css';

export const PackFieldEditorTemplate: React.FC<PackFieldEditorProps> = ({
  field,
  disabled,
  onKeyChange,
  onLabelChange,
  onBucketChange,
  onHintChange,
  onRemove,
}) => {
  return (
    <div className={styles.row}>
      <Input
        label="Key"
        value={field.key}
        disabled={disabled}
        onChange={(event) => onKeyChange(event.target.value)}
      />
      <Input
        label="Label"
        value={field.label}
        disabled={disabled}
        onChange={(event) => onLabelChange(event.target.value)}
      />
      <label className={styles['bucket-field']}>
        <span className={styles['bucket-label']}>Bucket</span>
        <select
          className={styles['bucket-select']}
          value={field.bucket}
          disabled={disabled}
          onChange={(event) =>
            onBucketChange(event.target.value === 'predefined' ? 'predefined' : 'userDefined')
          }
        >
          <option value="userDefined">User-defined</option>
          <option value="predefined">Predefined</option>
        </select>
      </label>
      <Input
        label="Hint"
        value={field.hint}
        disabled={disabled}
        onChange={(event) => onHintChange(event.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`Remove field ${field.label || field.key || 'row'}`}
      >
        Remove
      </Button>
    </div>
  );
};
