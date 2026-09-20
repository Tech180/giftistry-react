import React from 'react';
import { Sparkles } from 'lucide-react';
import { Switch } from 'shared/ui';
import type { AiSectionTemplateProps } from './interfaces/template-props.interface';
import { FeatureToggles } from './components/feature-toggles/feature-toggles.component';
import { Timeouts } from './components/timeouts/timeouts.component';
import { ConnectionPanel } from './components/connection-panel/connection-panel.component';
import { ModelPicker } from './components/model-picker/model-picker.component';
import { PromptsPacksWorkspace } from './components/prompts-packs-workspace/prompts-packs-workspace.component';
import styles from './ai-section.module.css';

export const AiSectionTemplate: React.FC<AiSectionTemplateProps> = ({
  aiEnabled,
  setAiEnabled,
  aiWebSearchEnabled,
  setAiWebSearchEnabled,
  aiRateLimitEnabled,
  setAiRateLimitEnabled,
  aiImportChunkingEnabled,
  setAiImportChunkingEnabled,
  aiImportChunkItemLimit,
  setAiImportChunkItemLimit,
  aiConnectTimeoutMs,
  setAiConnectTimeoutMs,
  aiCompletionTimeoutMs,
  setAiCompletionTimeoutMs,
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
  openrouterModels,
  isLoadingModels,
  companies,
  onLocalModelSelection,
  onTestAiConnection,
  aiEnabledPackIds,
  onEnabledPackIdsChange,
  aiCustomPacks,
  onCustomPacksChange,
  connectionSlot,
  setConnectionSlot,
  isFastSlot,
  activeProvider,
  setActiveProvider,
  activeEndpoint,
  setActiveEndpoint,
  activeApiKey,
  setActiveApiKey,
  showActiveAiKey,
  setShowActiveAiKey,
  activeConnectionStatus,
  activeConnectionMessage,
  isTestingAiConnection,
  localModelSelectDisabled,
  activeLocalModels,
  showModelPicker,
  activeModel,
  setActiveModel,
  activeSelectedCompany,
  setActiveSelectedCompany,
  activeFilteredModels,
  activeLocalModelMode,
  modelHelper,
}) => (
  <section className={styles.section}>
    <h2 className={styles['section__header']}>AI Integration Settings</h2>
    <div className={styles['section__list']}>
      <div className={styles['section__card-header']}>
        <div className={styles['section__header-left']}>
          <div className={styles['section__icon']}>
            <Sparkles size={16} className={styles['section__icon-svg']} />
          </div>
          <div>
            <h3 className={styles['section__title']}>AI Assistant Integration</h3>
            <p className={styles['section__subtitle']}>Enable intelligent features across Giftistry.</p>
          </div>
        </div>
        <div className={styles['section__action']}>
          <Switch
            checked={aiEnabled}
            onChange={setAiEnabled}
            aria-label="Enable AI assistant integration"
          />
        </div>
      </div>

      <div
        className={`${styles['section__expandable']} ${aiEnabled ? styles['section__expandable--active'] : ''}`}
      >
        <div className={styles['section__expandable-content']}>
          <div className={styles['section__expandable-inner']}>
            <FeatureToggles
              aiEnabled = {
                aiEnabled
              }
              aiWebSearchEnabled = {
                aiWebSearchEnabled
              }
              setAiWebSearchEnabled = {
                setAiWebSearchEnabled
              }
              aiRateLimitEnabled = {
                aiRateLimitEnabled
              }
              setAiRateLimitEnabled = {
                setAiRateLimitEnabled
              }
              aiImportChunkingEnabled = {
                aiImportChunkingEnabled
              }
              setAiImportChunkingEnabled = {
                setAiImportChunkingEnabled
              }
              aiImportChunkItemLimit = {
                aiImportChunkItemLimit
              }
              setAiImportChunkItemLimit = {
                setAiImportChunkItemLimit
              }
            />

            <Timeouts
              aiEnabled = {
                aiEnabled
              }
              aiConnectTimeoutMs = {
                aiConnectTimeoutMs
              }
              setAiConnectTimeoutMs = {
                setAiConnectTimeoutMs
              }
              aiCompletionTimeoutMs = {
                aiCompletionTimeoutMs
              }
              setAiCompletionTimeoutMs = {
                setAiCompletionTimeoutMs
              }
            />

            <ConnectionPanel
              aiEnabled = {
                aiEnabled
              }
              connectionSlot = {
                connectionSlot
              }
              setConnectionSlot = {
                setConnectionSlot
              }
              isFastSlot = {
                isFastSlot
              }
              activeProvider = {
                activeProvider
              }
              setActiveProvider = {
                setActiveProvider
              }
              activeEndpoint = {
                activeEndpoint
              }
              setActiveEndpoint = {
                setActiveEndpoint
              }
              activeApiKey = {
                activeApiKey
              }
              setActiveApiKey = {
                setActiveApiKey
              }
              showActiveAiKey = {
                showActiveAiKey
              }
              setShowActiveAiKey = {
                setShowActiveAiKey
              }
              activeConnectionStatus = {
                activeConnectionStatus
              }
              activeConnectionMessage = {
                activeConnectionMessage
              }
              isTestingAiConnection = {
                isTestingAiConnection
              }
              onTestAiConnection = {
                onTestAiConnection
              }
            />

            {showModelPicker ? (
              <ModelPicker
                slot = {
                  connectionSlot
                }
                helper = {
                  modelHelper
                }
                model = {
                  activeModel
                }
                setModel = {
                  setActiveModel
                }
                selectedCompany = {
                  activeSelectedCompany
                }
                setSelectedCompany = {
                  setActiveSelectedCompany
                }
                filteredModels = {
                  activeFilteredModels
                }
                localModelMode = {
                  activeLocalModelMode
                }
                slotLocalModels = {
                  activeLocalModels
                }
                provider = {
                  activeProvider
                }
                aiEnabled = {
                  aiEnabled
                }
                isLoadingModels = {
                  isLoadingModels
                }
                companies = {
                  companies
                }
                openrouterModels = {
                  openrouterModels
                }
                localModelSelectDisabled = {
                  localModelSelectDisabled
                }
                isTestingAiConnection = {
                  isTestingAiConnection
                }
                onLocalModelSelection = {
                  onLocalModelSelection
                }
              />
            ) : null}

            <PromptsPacksWorkspace
              aiPrompt = {
                aiPrompt
              }
              setAiPrompt = {
                setAiPrompt
              }
              aiDescriptionPrompt = {
                aiDescriptionPrompt
              }
              setAiDescriptionPrompt = {
                setAiDescriptionPrompt
              }
              aiPopulatePrompt = {
                aiPopulatePrompt
              }
              setAiPopulatePrompt = {
                setAiPopulatePrompt
              }
              aiCategoryPrompt = {
                aiCategoryPrompt
              }
              setAiCategoryPrompt = {
                setAiCategoryPrompt
              }
              aiImportPrompt = {
                aiImportPrompt
              }
              setAiImportPrompt = {
                setAiImportPrompt
              }
              aiDefaultPrompts = {
                aiDefaultPrompts
              }
              onResetPrompt = {
                onResetPrompt
              }
              enabledPackIds = {
                aiEnabledPackIds
              }
              onEnabledPackIdsChange = {
                onEnabledPackIdsChange
              }
              customPacks = {
                aiCustomPacks
              }
              onCustomPacksChange = {
                onCustomPacksChange
              }
              disabled = {
                !aiEnabled
              }
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AiSectionTemplate;
