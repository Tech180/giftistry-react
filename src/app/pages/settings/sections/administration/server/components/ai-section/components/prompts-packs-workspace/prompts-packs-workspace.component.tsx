import React, { useId, useRef, useState } from 'react';
import type { CustomPackSettings } from 'features/system';
import {
  addMetadataPackId,
  filterDirectoryPacks,
  findDirectoryPack,
  listDirectoryPacks,
  mergeWorkspaceCatalog,
  removeMetadataPackId,
  useMetadataPacksCatalog,
} from 'features/system';
import type { PromptCodeEditorHandle } from '../prompt-code-editor/interfaces/handle.interface';
import { directoryEmptyMessage } from '../metadata-packs/utils/directory-empty-message.util';
import { DEFAULT_PROMPT_RESET_LABEL } from './constants/prompt-reset-label.constant';
import {
  PROMPT_PLACEHOLDER,
  PROMPT_WORKSPACE_ITEMS,
} from './constants/prompt-workspace-items.constant';
import type { PromptValues } from './interfaces/prompt-values.interface';
import type { PromptsPacksWorkspaceProps } from './interfaces/props.interface';
import type { WorkspaceView } from './interfaces/workspace-view.interface';
import { PromptsPacksWorkspaceTemplate } from './prompts-packs-workspace.html';
import { applyPromptValue } from './utils/apply-prompt-value.util';
import { collectPackIds } from './utils/collect-pack-ids.util';
import { emptyCustomPackDraft } from './utils/empty-custom-pack-draft.util';
import { isDirectoryWorkspaceView } from './utils/is-directory-workspace-view.util';
import { isTechnologyPack } from './utils/is-technology-pack.util';
import { promptResetLabel } from './utils/prompt-reset-label.util';
import { promptValueForType } from './utils/prompt-value-for-type.util';
import { toDirectoryPackListItem } from './utils/to-directory-pack-list-item.util';
import { toPromptValuesFromDefaults } from './utils/to-prompt-values-from-defaults.util';
import { toWorkspacePromptNavItem } from './utils/to-workspace-prompt-nav-item.util';

export const PromptsPacksWorkspace: React.FC<PromptsPacksWorkspaceProps> = ({
  aiPrompt,
  setAiPrompt,
  aiDescriptionPrompt,
  setAiDescriptionPrompt,
  aiPopulatePrompt,
  setAiPopulatePrompt,
  aiCategoryPrompt,
  setAiCategoryPrompt,
  aiImportPrompt,
  setAiImportPrompt,
  aiDefaultPrompts,
  onResetPrompt,
  enabledPackIds,
  onEnabledPackIdsChange,
  customPacks,
  onCustomPacksChange,
  disabled = false,
}) => {
  const { catalog, isLoading, error } = useMetadataPacksCatalog();
  const [view, setView] = useState<WorkspaceView>({ kind: 'prompt', promptType: 'populate' });
  const [searchQuery, setSearchQuery] = useState('');
  const searchId = `packs-directory-search-${useId().replace(/:/g, '')}`;
  const promptEditorRef = useRef<PromptCodeEditorHandle>(null);

  const mergedCatalog = mergeWorkspaceCatalog(catalog, customPacks);
  const directoryPacks = listDirectoryPacks(mergedCatalog);
  const directoryRows = filterDirectoryPacks(directoryPacks, searchQuery);
  const enabledIds = new Set(enabledPackIds);
  const selectedPackId =
    view.kind === 'pack-detail' || view.kind === 'pack-edit' ? view.packId : null;
  const selectedPack = selectedPackId
    ? (findDirectoryPack(directoryPacks, selectedPackId) ?? null)
    : null;
  const editorPack =
    view.kind === 'pack-create'
      ? emptyCustomPackDraft()
      : view.kind === 'pack-edit'
        ? (customPacks.find((pack) => pack.Id === view.packId) ?? null)
        : null;
  const activePrompt =
    view.kind === 'prompt'
      ? (PROMPT_WORKSPACE_ITEMS.find((item) => item.id === view.promptType) ?? null)
      : null;
  const currentValues: PromptValues = {
    review: aiPrompt,
    description: aiDescriptionPrompt,
    populate: aiPopulatePrompt,
    category: aiCategoryPrompt,
    import: aiImportPrompt,
  };
  const promptValue = view.kind === 'prompt' ? promptValueForType(view.promptType, currentValues) : '';
  const defaultPromptValue =
    aiDefaultPrompts && view.kind === 'prompt'
      ? promptValueForType(view.promptType, toPromptValuesFromDefaults(aiDefaultPrompts))
      : '';

  const applyCustomPack = (pack: CustomPackSettings) => {
    const exists = customPacks.some((item) => item.Id === pack.Id);
    const nextPacks = exists
      ? customPacks.map((item) => (item.Id === pack.Id ? pack : item))
      : [...customPacks, pack];
    onCustomPacksChange(nextPacks);
    if (!exists) {
      onEnabledPackIdsChange(addMetadataPackId(mergeWorkspaceCatalog(catalog, nextPacks), enabledPackIds, pack.Id));
    }
    setView({ kind: 'pack-detail', packId: pack.Id });
  };

  const deleteCustomPack = (packId: string) => {
    const nextPacks = customPacks.filter((pack) => pack.Id !== packId);
    onCustomPacksChange(nextPacks);
    onEnabledPackIdsChange(
      removeMetadataPackId(mergeWorkspaceCatalog(catalog, customPacks), enabledPackIds, packId)
    );
    setView({ kind: 'directory' });
  };

  return (
    <PromptsPacksWorkspaceTemplate
      view={view}
      promptNavItems={PROMPT_WORKSPACE_ITEMS.map((item) => toWorkspacePromptNavItem(item, view))}
      activePrompt={activePrompt}
      promptValue={promptValue}
      promptPlaceholder={PROMPT_PLACEHOLDER}
      resetLabel={view.kind === 'prompt' ? promptResetLabel(view.promptType) : DEFAULT_PROMPT_RESET_LABEL}
      showPopulateHint={activePrompt?.id === 'populate'}
      promptEditorAriaLabel={activePrompt ? `${activePrompt.label} AI prompt editor` : 'AI prompt editor'}
      canReset={Boolean(aiDefaultPrompts)}
      isAtDefault={Boolean(aiDefaultPrompts) && promptValue === defaultPromptValue}
      directoryActive={isDirectoryWorkspaceView(view)}
      directoryListItems={directoryRows.map((pack) => toDirectoryPackListItem(pack, enabledIds))}
      selectedPack={selectedPack}
      selectedPackEnabled={selectedPack ? enabledIds.has(selectedPack.Id) : false}
      selectedPackIsTechnology={selectedPack ? isTechnologyPack(selectedPack.Id) : false}
      fragmentAriaLabel={selectedPack ? `${selectedPack.Label} prompt fragment` : 'Prompt fragment'}
      enabledCount={enabledPackIds.length}
      searchQuery={searchQuery}
      searchId={searchId}
      emptyMessage={directoryEmptyMessage(searchQuery)}
      isLoading={isLoading}
      error={error}
      disabled={disabled}
      promptEditorRef={promptEditorRef}
      editorPack={editorPack}
      editorTakenIds={collectPackIds(mergedCatalog)}
      onSelectPrompt={(promptType) => setView({ kind: 'prompt', promptType })}
      onSelectDirectory={() => setView({ kind: 'directory' })}
      onSelectPack={(packId) => setView({ kind: 'pack-detail', packId })}
      onSearchChange={setSearchQuery}
      onTogglePack={(packId, enabled) => {
        onEnabledPackIdsChange(
          enabled
            ? addMetadataPackId(mergedCatalog, enabledPackIds, packId)
            : removeMetadataPackId(mergedCatalog, enabledPackIds, packId)
        );
      }}
      onPromptChange={(value) => {
        if (view.kind !== 'prompt') {
          return;
        }

        applyPromptValue(view.promptType, value, {
          review: setAiPrompt,
          description: setAiDescriptionPrompt,
          populate: setAiPopulatePrompt,
          category: setAiCategoryPrompt,
          import: setAiImportPrompt,
        });
      }}
      onResetPrompt={() => {
        if (view.kind === 'prompt') {
          onResetPrompt(view.promptType);
        }
      }}
      onInsertToken={(token) => {
        promptEditorRef.current?.insertAtCursor(token);
      }}
      onCreatePack={() => setView({ kind: 'pack-create' })}
      onEditPack={(packId) => setView({ kind: 'pack-edit', packId })}
      onDeletePack={deleteCustomPack}
      onApplyEditor={applyCustomPack}
      onCancelEditor={() => setView({ kind: 'directory' })}
    />
  );
};
