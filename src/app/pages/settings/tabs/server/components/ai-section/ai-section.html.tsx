import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Search, Gauge, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Switch } from 'shared/ui';
import { AiSectionProps, type AiModelSlot } from '../../interfaces/ai-section-props.interface';
import type { AiSlotProvider } from '../../interfaces/backend-settings.interface';
import {
  LOCAL_AI_CUSTOM_MODEL_VALUE,
  isModelInLocalList,
  type LocalAiModelMode,
} from '../../interfaces/local-ai-model.interface';
import { PromptsPacksWorkspace } from './components/prompts-packs-workspace/prompts-packs-workspace.component';
import styles from './ai-section.module.css';

type OpenRouterModelOption = { id: string; name: string; company: string; displayName: string };

export const AiSectionTemplate: React.FC<AiSectionProps> = ({
  aiEnabled,
  setAiEnabled,
  aiWebSearchEnabled,
  setAiWebSearchEnabled,
  aiRateLimitEnabled,
  setAiRateLimitEnabled,
  aiCompletionTimeoutMs,
  setAiCompletionTimeoutMs,
  aiFastProvider,
  setAiFastProvider,
  aiFastEndpoint,
  setAiFastEndpoint,
  aiFastApiKey,
  setAiFastApiKey,
  aiFastModel,
  setAiFastModel,
  aiIntelligentProvider,
  setAiIntelligentProvider,
  aiIntelligentEndpoint,
  setAiIntelligentEndpoint,
  aiIntelligentApiKey,
  setAiIntelligentApiKey,
  aiIntelligentModel,
  setAiIntelligentModel,
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
  showFastAiKey,
  setShowFastAiKey,
  showIntelligentAiKey,
  setShowIntelligentAiKey,
  openrouterModels,
  isLoadingModels,
  companies,
  selectedFastCompany,
  setSelectedFastCompany,
  selectedIntelligentCompany,
  setSelectedIntelligentCompany,
  filteredFastModels,
  filteredIntelligentModels,
  localFastModels,
  localIntelligentModels,
  localFastModelMode,
  localIntelligentModelMode,
  onLocalModelSelection,
  fastConnectionStatus,
  fastConnectionMessage,
  intelligentConnectionStatus,
  intelligentConnectionMessage,
  onTestAiConnection,
  aiEnabledPackIds,
  onEnabledPackIdsChange,
  aiCustomPacks,
  onCustomPacksChange,
}) => {
  const [connectionSlot, setConnectionSlot] = useState<AiModelSlot>('fast');

  const isFastSlot = connectionSlot === 'fast';
  const activeProvider: AiSlotProvider = isFastSlot ? aiFastProvider : aiIntelligentProvider;
  const setActiveProvider = isFastSlot ? setAiFastProvider : setAiIntelligentProvider;
  const activeEndpoint = isFastSlot ? aiFastEndpoint : aiIntelligentEndpoint;
  const setActiveEndpoint = isFastSlot ? setAiFastEndpoint : setAiIntelligentEndpoint;
  const activeApiKey = isFastSlot ? aiFastApiKey : aiIntelligentApiKey;
  const setActiveApiKey = isFastSlot ? setAiFastApiKey : setAiIntelligentApiKey;
  const showActiveAiKey = isFastSlot ? showFastAiKey : showIntelligentAiKey;
  const setShowActiveAiKey = isFastSlot ? setShowFastAiKey : setShowIntelligentAiKey;
  const activeConnectionStatus = isFastSlot ? fastConnectionStatus : intelligentConnectionStatus;
  const activeConnectionMessage = isFastSlot ? fastConnectionMessage : intelligentConnectionMessage;
  const isTestingAiConnection = activeConnectionStatus === 'checking';
  const localModelSelectDisabled = isTestingAiConnection;
  const activeLocalModels = isFastSlot ? localFastModels : localIntelligentModels;
  const showModelPicker =
    activeProvider === 'local'
      ? activeEndpoint.trim().length > 0 &&
        (activeConnectionStatus === 'success' || activeLocalModels.length > 0)
      : activeApiKey.trim().length > 0;

  const renderModelPicker = ({
    slot,
    helper,
    model,
    setModel,
    selectedCompany,
    setSelectedCompany,
    filteredModels,
    localModelMode,
    slotLocalModels,
    provider,
  }: {
    slot: AiModelSlot;
    helper: string;
    model: string;
    setModel: (value: string) => void;
    selectedCompany: string;
    setSelectedCompany: (value: string) => void;
    filteredModels: OpenRouterModelOption[];
    localModelMode: LocalAiModelMode;
    slotLocalModels: string[];
    provider: AiSlotProvider;
  }) => {
    const selectId = `ai-${slot}-model-select`;
    const inputId = `ai-${slot}-model-input`;
    const companyId = `ai-${slot}-company-select`;
    const localModelSelectValue =
      localModelMode === 'custom'
        ? LOCAL_AI_CUSTOM_MODEL_VALUE
        : isModelInLocalList(model, slotLocalModels)
          ? model
          : '';

    if (provider !== 'local') {
      return (
        <div className={styles['input-group']}>
          <div className={styles['model-picker-row']}>
            <div className={styles['input-group']}>
              <label className={styles['input-label']} htmlFor={companyId}>
                Company
              </label>
              <div className={styles['select-box']}>
                <select
                  id={companyId}
                  className={styles['input-field']}
                  value={selectedCompany}
                  onChange={(e) => {
                    const newCompany = e.target.value;
                    setSelectedCompany(newCompany);
                    const firstModel = openrouterModels.find((m) => m.company === newCompany);
                    if (firstModel) {
                      setModel(firstModel.id);
                    }
                  }}
                  disabled={isLoadingModels}
                  aria-label="Company"
                >
                  {isLoadingModels ? (
                    <option value="">Loading companies...</option>
                  ) : (
                    <>
                      <option value="">Select a company...</option>
                      {companies.map((company) => (
                        <option key={`${slot}-${company}`} value={company}>
                          {company}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className={styles['input-group']}>
              <label className={styles['input-label']} htmlFor={selectId}>
                Model
              </label>
              <div className={styles['select-box']}>
                <select
                  id={selectId}
                  className={styles['input-field']}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required={aiEnabled}
                  disabled={isLoadingModels || !selectedCompany}
                  aria-label="Model"
                >
                  {isLoadingModels ? (
                    <option value="">Loading models...</option>
                  ) : !selectedCompany ? (
                    <option value="">Select a company first...</option>
                  ) : (
                    <>
                      <option value="">Select a model...</option>
                      {filteredModels.map((modelItem) => (
                        <option key={modelItem.id} value={modelItem.id}>
                          {modelItem.displayName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
          <span className={styles['help-text']}>{helper}</span>
        </div>
      );
    }

    return (
      <div className={styles['input-group']}>
        <label
          className={styles['input-label']}
          htmlFor={
            slotLocalModels.length > 0 && localModelMode === 'listed' ? selectId : inputId
          }
        >
          Model
        </label>
        <div className={styles['local-model-row']}>
          {slotLocalModels.length > 0 && (
            <div
              className={`${styles['select-box']} ${
                localModelMode === 'listed' ? styles['local-model-select-full'] : ''
              }`}
            >
              <select
                id={selectId}
                className={styles['input-field']}
                value={localModelSelectValue}
                onChange={(e) => onLocalModelSelection(slot, e.target.value)}
                disabled={localModelSelectDisabled}
                aria-label="Discovered models"
              >
                {isTestingAiConnection ? (
                  <option value={LOCAL_AI_CUSTOM_MODEL_VALUE}>Discovering models…</option>
                ) : (
                  <>
                    {slotLocalModels.map((modelId) => (
                      <option key={`${slot}-${modelId}`} value={modelId}>
                        {modelId}
                      </option>
                    ))}
                    <option value={LOCAL_AI_CUSTOM_MODEL_VALUE}>Custom model…</option>
                  </>
                )}
              </select>
            </div>
          )}
          {(slotLocalModels.length === 0 || localModelMode === 'custom') && (
            <input
              type="text"
              id={inputId}
              className={styles['input-field']}
              placeholder="llama3"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isTestingAiConnection}
              aria-label="Model"
            />
          )}
        </div>
        <span className={styles['help-text']}>{helper}</span>
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <h2 className={styles['section-header']}>AI Integration Settings</h2>
      <div className={styles['setting-list']}>
        <div className={styles['ai-card-header']}>
          <div className={styles['ai-header-left']}>
            <div className={styles['ai-icon-container']}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className={styles['ai-title']}>AI Assistant Integration</h3>
              <p className={styles['ai-subtitle']}>Enable intelligent features across Giftistry.</p>
            </div>
          </div>
          <div className={styles['setting-action']}>
            <Switch
              checked={aiEnabled}
              onChange={setAiEnabled}
              aria-label="Enable AI assistant integration"
            />
          </div>
        </div>

        <div className={`${styles['expandable-area']} ${aiEnabled ? styles['expandable-area-active'] : ''}`}>
          <div className={styles['expandable-content']}>
            <div className={styles['expandable-inner']}>
              <div className={styles['web-search-row']}>
                <div className={styles['web-search-copy']}>
                  <div className={styles['web-search-icon']} aria-hidden="true">
                    <Search size={14} />
                  </div>
                  <div>
                    <h3 className={styles['subsection-title']}>Web Search</h3>
                    <p className={styles['ai-subtitle']}>
                      Augment product scrape with web research and AI reconcile when adding items.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={aiWebSearchEnabled}
                  onChange={setAiWebSearchEnabled}
                  disabled={!aiEnabled}
                  aria-label="Enable web search for product scrape"
                />
              </div>

              <div className={styles['web-search-row']}>
                <div className={styles['web-search-copy']}>
                  <div className={styles['web-search-icon']} aria-hidden="true">
                    <Gauge size={14} />
                  </div>
                  <div>
                    <h3 className={styles['subsection-title']}>Rate Limiting</h3>
                    <p className={styles['ai-subtitle']}>
                      Limit AI request frequency to protect provider quotas and local resources.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={aiRateLimitEnabled}
                  onChange={setAiRateLimitEnabled}
                  disabled={!aiEnabled}
                  aria-label="Enable AI rate limiting"
                />
              </div>

              <div className={styles['input-wrapper']}>
                <label className={styles['input-label']} htmlFor="ai-completion-timeout-ms">
                  AI request timeout (ms)
                </label>
                <p className={styles['ai-subtitle']}>
                  How long import, populate, and other AI calls may run before failing.
                </p>
                <input
                  id="ai-completion-timeout-ms"
                  type="number"
                  min={30000}
                  max={1800000}
                  step={1000}
                  className={styles['input-field']}
                  value={aiCompletionTimeoutMs}
                  onChange={(e) => setAiCompletionTimeoutMs(Number(e.target.value))}
                  disabled={!aiEnabled}
                  aria-label="AI request timeout in milliseconds"
                />
              </div>

              <div className={styles['connection-section']}>
                <h3 className={styles['subsection-title']}>Connection</h3>

                <div className={styles['tab-container']}>
                  <button
                    type="button"
                    className={`${styles['tab-button']} ${isFastSlot ? styles['tab-button-active'] : ''}`}
                    onClick={() => setConnectionSlot('fast')}
                  >
                    Fast
                  </button>
                  <button
                    type="button"
                    className={`${styles['tab-button']} ${!isFastSlot ? styles['tab-button-active'] : ''}`}
                    onClick={() => setConnectionSlot('intelligent')}
                  >
                    Intelligent
                  </button>
                </div>

                <div className={styles['tab-container']}>
                  <button
                    type="button"
                    className={`${styles['tab-button']} ${activeProvider === 'local' ? styles['tab-button-active'] : ''}`}
                    onClick={() => setActiveProvider('local')}
                  >
                    Local Instance
                  </button>
                  <button
                    type="button"
                    className={`${styles['tab-button']} ${activeProvider !== 'local' ? styles['tab-button-active'] : ''}`}
                    onClick={() => setActiveProvider('openrouter')}
                  >
                    Global Models (API)
                  </button>
                </div>

                <div className={styles['form-grid']}>
                  <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles['input-group']}>
                      <label className={styles['input-label']}>
                        {activeProvider === 'local' ? 'API Key' : 'API Key *'}
                      </label>
                      <div className={styles['input-box']}>
                        <input
                          type={showActiveAiKey ? 'text' : 'password'}
                          className={styles['input-field']}
                          placeholder="Secret"
                          value={activeApiKey}
                          onChange={(e) => setActiveApiKey(e.target.value)}
                          required={aiEnabled && activeProvider !== 'local'}
                        />
                        <button
                          type="button"
                          className={styles['input-icon-btn']}
                          onClick={() => setShowActiveAiKey(!showActiveAiKey)}
                        >
                          {showActiveAiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className={styles['input-group']}>
                      <div className={styles['input-label-row']}>
                        <label className={styles['input-label']}>API Endpoint URL</label>
                        {activeProvider === 'local' && activeConnectionStatus !== 'idle' && (
                          <span
                            className={`${styles['connection-status-icon']} ${
                              activeConnectionStatus === 'success'
                                ? styles['connection-status-success']
                                : activeConnectionStatus === 'error'
                                  ? styles['connection-status-error']
                                  : styles['connection-status-checking']
                            }`}
                            title={activeConnectionMessage}
                            aria-label={activeConnectionMessage}
                            role="status"
                          >
                            {activeConnectionStatus === 'success' && <CheckCircle2 size={14} />}
                            {activeConnectionStatus === 'error' && <AlertCircle size={14} />}
                            {activeConnectionStatus === 'checking' && (
                              <Loader2 size={14} className={styles['refresh-connection-spinner']} />
                            )}
                          </span>
                        )}
                      </div>
                      <div className={styles['endpoint-row']}>
                        <input
                          type="text"
                          className={styles['input-field']}
                          placeholder={
                            activeProvider === 'local' ? 'http://localhost:11434/v1' : 'https://openrouter.ai/api/v1'
                          }
                          value={activeEndpoint}
                          onChange={(e) => setActiveEndpoint(e.target.value)}
                          required={aiEnabled && activeProvider === 'local'}
                        />
                        {activeProvider === 'local' && (
                          <button
                            type="button"
                            className={styles['refresh-connection-btn']}
                            onClick={() => onTestAiConnection(connectionSlot)}
                            disabled={isTestingAiConnection || !activeEndpoint.trim()}
                            title="Test connection"
                            aria-label="Test connection"
                          >
                            <RefreshCw
                              size={14}
                              className={isTestingAiConnection ? styles['refresh-connection-spinner'] : undefined}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {showModelPicker && (
                    <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                      {isFastSlot
                        ? renderModelPicker({
                            slot: 'fast',
                            helper: 'Recommended for ~8B / fast processing (import, grab info)',
                            model: aiFastModel,
                            setModel: setAiFastModel,
                            selectedCompany: selectedFastCompany,
                            setSelectedCompany: setSelectedFastCompany,
                            filteredModels: filteredFastModels,
                            localModelMode: localFastModelMode,
                            slotLocalModels: localFastModels,
                            provider: aiFastProvider,
                          })
                        : renderModelPicker({
                            slot: 'intelligent',
                            helper: 'Recommended for ~27B / deep research and reviews',
                            model: aiIntelligentModel,
                            setModel: setAiIntelligentModel,
                            selectedCompany: selectedIntelligentCompany,
                            setSelectedCompany: setSelectedIntelligentCompany,
                            filteredModels: filteredIntelligentModels,
                            localModelMode: localIntelligentModelMode,
                            slotLocalModels: localIntelligentModels,
                            provider: aiIntelligentProvider,
                          })}
                    </div>
                  )}
                </div>
              </div>

              <PromptsPacksWorkspace
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                aiDescriptionPrompt={aiDescriptionPrompt}
                setAiDescriptionPrompt={setAiDescriptionPrompt}
                aiPopulatePrompt={aiPopulatePrompt}
                setAiPopulatePrompt={setAiPopulatePrompt}
                aiCategoryPrompt={aiCategoryPrompt}
                setAiCategoryPrompt={setAiCategoryPrompt}
                aiImportPrompt={aiImportPrompt}
                setAiImportPrompt={setAiImportPrompt}
                aiDefaultPrompts={aiDefaultPrompts}
                onResetPrompt={onResetPrompt}
                enabledPackIds={aiEnabledPackIds}
                onEnabledPackIdsChange={onEnabledPackIdsChange}
                customPacks={aiCustomPacks}
                onCustomPacksChange={onCustomPacksChange}
                disabled={!aiEnabled}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AiSectionTemplate;
