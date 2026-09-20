import React from 'react';
import { Button, Input, SelectMenu } from 'shared/ui';
import {
  PACK_FIELD_BUCKET_MENU_TITLE,
  PACK_FIELD_BUCKET_OPTIONS,
} from './constants/pack-field-bucket-options.constant';
import type { PackFieldEditorProps } from './interfaces/props.interface';
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
      <div className={styles['bucket-field']}>
        <span className={styles['bucket-label']}>Bucket</span>
        <SelectMenu
          className={styles['bucket-select']}
          value={field.bucket}
          options={PACK_FIELD_BUCKET_OPTIONS}
          onChange={(next) => onBucketChange(next === 'predefined' ? 'predefined' : 'userDefined')}
          disabled={disabled}
          variant="field"
          menuTitle={PACK_FIELD_BUCKET_MENU_TITLE}
          aria-label="Bucket"
        />
      </div>
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
