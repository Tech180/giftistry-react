import React from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Button } from 'shared/ui';
import { PromptCodeEditor } from '../../../prompt-code-editor/prompt-code-editor.component';
import { PromptTokensList } from '../../../prompt-tokens-list/prompt-tokens-list.component';
import { WorkspacePromptIcon } from '../prompt-workspace-icon/prompt-workspace-icon.component';
import { WorkspaceViewHeader } from '../workspace-view-header/workspace-view-header.component';
import {
  POPULATE_PACK_HINT_BODY,
  POPULATE_PACK_HINT_LEAD,
} from './constants/populate-pack-hint.constant';
import type { PromptWorkspacePaneProps } from './interfaces/prompt-workspace-pane-props.interface';
import styles from './prompt-workspace-pane.module.css';

export const PromptWorkspacePaneTemplate: React.FC<PromptWorkspacePaneProps> = ({
  prompt,
  promptValue,
  promptPlaceholder,
  resetLabel,
  showPopulateHint,
  promptEditorAriaLabel,
  canReset,
  isAtDefault,
  disabled,
  promptEditorRef,
  onPromptChange,
  onResetPrompt,
  onInsertToken,
}) => {
  return (
    <>
      <WorkspaceViewHeader
        heading={prompt.label}
        leading={
          <span className={styles['title-icon']}>
            <WorkspacePromptIcon icon={prompt.icon} />
          </span>
        }
        actions={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            iconOnly
            className={styles['header-icon-btn']}
            leftIcon={<RotateCcw size={14} />}
            onClick={onResetPrompt}
            disabled={disabled || !canReset || isAtDefault}
            aria-label={resetLabel}
            title={resetLabel}
          />
        }
      />

      <div className={styles['prompt-body']}>
        <div className={styles['prompt-main']}>
          <p className={styles['prompt-desc']}>{prompt.description}</p>
          {showPopulateHint && (
            <div className={styles['hint-box']}>
              <Info className={styles['hint-icon']} aria-hidden="true" />
              <div>
                <strong>{POPULATE_PACK_HINT_LEAD}</strong> {POPULATE_PACK_HINT_BODY}
              </div>
            </div>
          )}
          <PromptCodeEditor
            ref={promptEditorRef}
            value={promptValue}
            onChange={onPromptChange}
            placeholder={promptPlaceholder}
            knownTokens={prompt.tokens}
            readOnly={disabled}
            aria-label={promptEditorAriaLabel}
          />
        </div>
        <PromptTokensList tokens={prompt.tokens} onInsertToken={onInsertToken} />
      </div>
    </>
  );
};
