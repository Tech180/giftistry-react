import React from 'react';
import { DirectoryWorkspacePane } from './components/directory-workspace-pane/directory-workspace-pane.component';
import { PackDetailPane } from './components/pack-detail-pane/pack-detail-pane.component';
import { PackEditorPane } from './components/pack-editor-pane/pack-editor-pane.component';
import { PromptWorkspacePane } from './components/prompt-workspace-pane/prompt-workspace-pane.component';
import { WorkspaceSidebar } from './components/workspace-sidebar/workspace-sidebar.component';
import { PACK_NOT_FOUND_MESSAGE } from './constants/pack-not-found-message.constant';
import type { PromptsPacksWorkspaceTemplateProps } from './interfaces/prompts-packs-workspace-template-props.interface';
import styles from './prompts-packs-workspace.module.css';

export const PromptsPacksWorkspaceTemplate: React.FC<PromptsPacksWorkspaceTemplateProps> = ({
  view,
  promptNavItems,
  activePrompt,
  promptValue,
  promptPlaceholder,
  resetLabel,
  showPopulateHint,
  promptEditorAriaLabel,
  canReset,
  isAtDefault,
  directoryActive,
  directoryListItems,
  selectedPack,
  selectedPackEnabled,
  selectedPackIsTechnology,
  fragmentAriaLabel,
  enabledCount,
  searchQuery,
  searchId,
  emptyMessage,
  isLoading,
  error,
  disabled,
  promptEditorRef,
  editorPack,
  editorTakenIds,
  onSelectPrompt,
  onSelectDirectory,
  onSelectPack,
  onSearchChange,
  onTogglePack,
  onPromptChange,
  onResetPrompt,
  onInsertToken,
  onCreatePack,
  onEditPack,
  onDeletePack,
  onApplyEditor,
  onCancelEditor,
}) => {
  return (
    <section className={styles.workspace} aria-label="Prompts and metadata packs">
      <WorkspaceSidebar
        promptNavItems={promptNavItems}
        directoryActive={directoryActive}
        enabledCount={enabledCount}
        onSelectPrompt={onSelectPrompt}
        onSelectDirectory={onSelectDirectory}
      />

      <div className={styles.content}>
        {view.kind === 'prompt' && activePrompt && (
          <PromptWorkspacePane
            prompt={activePrompt}
            promptValue={promptValue}
            promptPlaceholder={promptPlaceholder}
            resetLabel={resetLabel}
            showPopulateHint={showPopulateHint}
            promptEditorAriaLabel={promptEditorAriaLabel}
            canReset={canReset}
            isAtDefault={isAtDefault}
            disabled={disabled}
            promptEditorRef={promptEditorRef}
            onPromptChange={onPromptChange}
            onResetPrompt={onResetPrompt}
            onInsertToken={onInsertToken}
          />
        )}

        {view.kind === 'directory' && (
          <DirectoryWorkspacePane
            items={directoryListItems}
            searchQuery={searchQuery}
            searchId={searchId}
            emptyMessage={emptyMessage}
            isLoading={isLoading}
            error={error}
            disabled={disabled}
            onSearchChange={onSearchChange}
            onSelectPack={onSelectPack}
            onTogglePack={onTogglePack}
            onCreatePack={onCreatePack}
          />
        )}

        {view.kind === 'pack-detail' && !selectedPack && (
          <div className={styles['empty-state']}>{PACK_NOT_FOUND_MESSAGE}</div>
        )}

        {view.kind === 'pack-detail' && selectedPack && (
          <PackDetailPane
            pack={selectedPack}
            enabled={selectedPackEnabled}
            isTechnology={selectedPackIsTechnology}
            fragmentAriaLabel={fragmentAriaLabel}
            disabled={disabled}
            onBack={onSelectDirectory}
            onToggle={(next) => onTogglePack(selectedPack.Id, next)}
            onEdit={selectedPack.IsCustom ? () => onEditPack(selectedPack.Id) : undefined}
            onDelete={selectedPack.IsCustom ? () => onDeletePack(selectedPack.Id) : undefined}
          />
        )}

        {view.kind === 'pack-create' && editorPack && (
          <PackEditorPane
            key="pack-create"
            mode="create"
            initialPack={editorPack}
            takenIds={editorTakenIds}
            disabled={disabled}
            onCancel={onCancelEditor}
            onApply={onApplyEditor}
          />
        )}

        {view.kind === 'pack-edit' && editorPack && (
          <PackEditorPane
            key={editorPack.Id}
            mode="edit"
            initialPack={editorPack}
            takenIds={editorTakenIds}
            disabled={disabled}
            onCancel={onCancelEditor}
            onApply={onApplyEditor}
            onDelete={() => onDeletePack(editorPack.Id)}
          />
        )}

        {view.kind === 'pack-edit' && !editorPack && (
          <div className={styles['empty-state']}>{PACK_NOT_FOUND_MESSAGE}</div>
        )}
      </div>
    </section>
  );
};
