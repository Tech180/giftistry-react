import React from 'react';
import { Undo2 } from 'lucide-react';
import { Button, AiStatusBadge } from 'shared/ui';
import { MetadataGrid } from '../../../item-presentation/metadata-grid/metadata-grid.component';
import type { Props } from './interfaces/props.interface';
import styles from './notes.module.css';

export const NotesTemplate: React.FC<Props> = ({
  description,
  setDescription,
  canSummarizeNotes,
  isSummarizingNotes,
  canUndoSummarize,
  onSummarizeNotes,
  onUndoSummarize,
  isAutopopulating,
  isLoading,
  readOnly = false,
  hasReadOnlyMetadata,
  readOnlyMetadataPredefined,
  readOnlyMetadataUserDefined,
  metadataBadgeEmoji,
}) => (
  <>
    <div className={styles.notes}>
      <div className={styles['notes__label-row']}>
        <label className={styles['notes__label']}>Notes &amp; Details</label>
        {canSummarizeNotes && (
          <div className={styles['notes__actions']}>
            {canUndoSummarize && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                iconOnly
                onClick={onUndoSummarize}
                disabled={isSummarizingNotes || isAutopopulating || isLoading}
                aria-label="Undo summarize"
                title="Undo summarize"
                leftIcon={<Undo2 size={14} />}
              />
            )}
            <AiStatusBadge
              enabled
              label="Summarize"
              onToggle={onSummarizeNotes}
              disabled={isSummarizingNotes || isAutopopulating || isLoading}
            />
          </div>
        )}
      </div>
      {isSummarizingNotes && (
        <p className={styles['notes__summarize-status']}>Generating notes...</p>
      )}
      <textarea
        className={styles['notes__textarea']}
        placeholder="Add specific details, reasons you want this, or alternative options..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
    </div>

    {readOnly && hasReadOnlyMetadata && (
      <div className={styles['notes__metadata']}>
        <h4 className={styles['notes__panel-title']}>Details</h4>
        <MetadataGrid
          predefinedDisplayEntries={readOnlyMetadataPredefined}
          userDefinedEntries={readOnlyMetadataUserDefined}
          metadataBadgeEmoji={metadataBadgeEmoji}
          variant="badges"
        />
      </div>
    )}
  </>
);
