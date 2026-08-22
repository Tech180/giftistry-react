import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button, Switch } from 'shared/ui';
import { PromptCodeEditor } from '../../../prompt-code-editor/prompt-code-editor.component';
import { PackCategoryIcon } from '../pack-category-icon/pack-category-icon.component';
import { WorkspaceViewHeader } from '../workspace-view-header/workspace-view-header.component';
import {
  EXTRACTED_FIELDS_HINT,
  NO_EXPLICIT_FIELDS_MESSAGE,
  PROMPT_FRAGMENT_HINT,
} from './constants/pack-detail-copy.constant';
import type { PackDetailPaneTemplateProps } from './interfaces/pack-detail-pane-template-props.interface';
import styles from './pack-detail-pane.module.css';

export const PackDetailPaneTemplate: React.FC<PackDetailPaneTemplateProps> = ({
  pack,
  enabled,
  isTechnology,
  fragmentAriaLabel,
  toggleAriaLabel,
  disabled,
  isCustom,
  onBack,
  onToggle,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <WorkspaceViewHeader
        heading={pack.Label}
        leading={
          <>
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
            <span className={styles['title-icon']}>
              <PackCategoryIcon isTechnology={isTechnology} size={16} />
            </span>
          </>
        }
        actions={
          <div className={styles['header-actions']}>
            {isCustom && (
              <>
                <Button type="button" variant="secondary" size="sm" disabled={disabled} onClick={onEdit}>
                  Edit
                </Button>
                <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onDelete}>
                  Delete
                </Button>
              </>
            )}
            <Switch
              size="sm"
              checked={enabled}
              disabled={disabled}
              aria-label={toggleAriaLabel}
              onChange={onToggle}
            />
          </div>
        }
      />

      <div className={styles['detail-body']}>
        <div className={styles['detail-section']}>
          <h4 className={styles['detail-label']}>Description</h4>
          <p className={styles['detail-text']}>{pack.Description}</p>
        </div>

        <div className={styles['detail-section']}>
          <h4 className={styles['detail-label']}>Extracted Fields</h4>
          <p className={styles['detail-hint']}>{EXTRACTED_FIELDS_HINT}</p>
          <div className={styles['fields-grid']}>
            {pack.Fields.length === 0 && (
              <p className={styles['detail-hint']}>{NO_EXPLICIT_FIELDS_MESSAGE}</p>
            )}
            {pack.Fields.map((field) => (
              <span key={field.Key} className={styles['field-pill']}>
                {field.Label}
              </span>
            ))}
          </div>
        </div>

        <div className={styles['detail-section']}>
          <h4 className={styles['detail-label']}>Prompt Fragment</h4>
          <p className={styles['detail-hint']}>{PROMPT_FRAGMENT_HINT}</p>
          <PromptCodeEditor value={pack.PromptFragment} readOnly aria-label={fragmentAriaLabel} />
        </div>
      </div>
    </>
  );
};
