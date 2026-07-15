import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Sparkles, Search, Gauge, CheckCircle2, AlertCircle, RefreshCw, Loader2, RotateCcw } from 'lucide-react';
import { Switch, Button } from 'shared/ui';
import { AiSectionProps, type AiModelSlot } from '../../interfaces/ai-section-props.interface';
import type { AiSlotProvider } from '../../interfaces/backend-settings.interface';
import {
  LOCAL_AI_CUSTOM_MODEL_VALUE,
  isModelInLocalList,
  type LocalAiModelMode,
} from '../../interfaces/local-ai-model.interface';
import type { PromptType } from '../../utils/ai-prompt-settings.util';
import {
  assemblePopulateHubPrompt,
  extractPopulateBodyFromCombined,
  getPopulateHubReadOnlyStartIndex,
} from '../../utils/populate-hub-prompt.util';
import { PromptCodeEditor } from './components/prompt-code-editor/prompt-code-editor.component';
import styles from './ai-section.module.css';

const PROMPT_PLACEHOLDER =
  'Loaded from server defaults; edit and save to customize.';

const PROMPT_ITEMS: Array<{
  id: PromptType;
  label: string;
  description: string;
  tokens: string[];
}> = [
  {
    id: 'review',
    label: 'Review',
    description: 'AI review synthesis on item links (pros, cons, and summary).',
    tokens: ['{itemName}', '{category}', '{url}', '{pageContext}'],
  },
  {
    id: 'populate',
    label: 'Populate',
    description:
      'Auto-fill item fields from a product URL. One combined prompt (Populate + Description + Category) is sent to AI.',
    tokens: ['{url}', '{websiteName}', '{pageContext}', '{itemName}'],
  },
  {
    id: 'description',
    label: 'Description',
    description: 'AI Summarize notes in the add-item form. Also linked when auto-filling from a URL.',
    tokens: ['{itemName}', '{category}', '{url}', '{price}', '{websiteName}', '{existingNotes}', '{itemContext}'],
  },
  {
    id: 'category',
    label: 'Category',
    description: 'Classify items into tailored categories when auto-filling from a URL.',
    tokens: ['{url}', '{websiteName}', '{pageContext}', '{itemName}'],
  },
  {
    id: 'import',
    label: 'Import',
    description:
      'Turn uploaded wishlist exports (CSV, XLSX, TXT, JSON, PDF) into structured items. Giftistry JSON/CSV may parse without AI.',
    tokens: ['{fileName}', '{format}', '{fileContent}', '{wishlistTitle}', '{existingCategories}'],
  },
];

const POPULATE_GROUP_CHILDREN: PromptType[] = ['description', 'category'];

const getPromptItem = (id: PromptType) => PROMPT_ITEMS.find((item) => item.id === id)!;

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
}) => {
  const [connectionSlot, setConnectionSlot] = useState<AiModelSlot>('fast');
  const [promptType, setPromptType] = useState<PromptType>('review');

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

  const activePrompt = PROMPT_ITEMS.find((item) => item.id === promptType) ?? PROMPT_ITEMS[0];

  const promptValue =
    promptType === 'review'
      ? aiPrompt
      : promptType === 'description'
        ? aiDescriptionPrompt
        : promptType === 'populate'
          ? aiPopulatePrompt
          : promptType === 'category'
            ? aiCategoryPrompt
            : aiImportPrompt;

  const setPromptValue = (value: string) => {
    if (promptType === 'review') {
      setAiPrompt(value);
    } else if (promptType === 'description') {
      setAiDescriptionPrompt(value);
    } else if (promptType === 'populate') {
      setAiPopulatePrompt(value);
    } else if (promptType === 'category') {
      setAiCategoryPrompt(value);
    } else {
      setAiImportPrompt(value);
    }
  };

  const defaultPromptValue = aiDefaultPrompts
    ? promptType === 'review'
      ? aiDefaultPrompts.Review
      : promptType === 'description'
        ? aiDefaultPrompts.Description
        : promptType === 'populate'
          ? aiDefaultPrompts.Populate
          : promptType === 'category'
            ? aiDefaultPrompts.Category
            : aiDefaultPrompts.Import
    : '';

  const isAtDefault = Boolean(aiDefaultPrompts) && promptValue === defaultPromptValue;

  const descriptionPromptItem = getPromptItem('description');
  const categoryPromptItem = getPromptItem('category');
  const populatePromptItem = getPromptItem('populate');
  const populateIsAtDefault =
    Boolean(aiDefaultPrompts) && aiPopulatePrompt === aiDefaultPrompts?.Populate;
  const isPopulateGroupActive =
    promptType === 'populate' ||
    promptType === 'description' ||
    promptType === 'category';

  const populateHubPrompt = useMemo(
    () =>
      assemblePopulateHubPrompt(
        aiPopulatePrompt,
        aiDescriptionPrompt,
        aiCategoryPrompt
      ),
    [aiPopulatePrompt, aiDescriptionPrompt, aiCategoryPrompt]
  );

  const populateHubTokens = useMemo(
    () =>
      Array.from(
        new Set([
          ...activePrompt.tokens,
          ...descriptionPromptItem.tokens,
          ...categoryPromptItem.tokens,
        ])
      ),
    [activePrompt.tokens, descriptionPromptItem.tokens, categoryPromptItem.tokens]
  );

  const populateHubReadOnlyStart = useMemo(
    () => getPopulateHubReadOnlyStartIndex(populateHubPrompt),
    [populateHubPrompt]
  );

  const handlePopulateHubChange = (combined: string) => {
    setAiPopulatePrompt(extractPopulateBodyFromCombined(combined));
  };

  const renderPromptHelp = (tokens: string[]) => (
    <span className={styles['help-text']}>
      Dynamic tokens are highlighted in the editor. Available for this prompt:{' '}
      {tokens.map((token, index) => (
        <React.Fragment key={token}>
          <code className={styles['help-token']}>{token}</code>
          {index < tokens.length - 1 ? ', ' : '.'}
        </React.Fragment>
      ))}
    </span>
  );

  const renderPopulateHub = () => (
    <>
      <PromptCodeEditor
        value={populateHubPrompt}
        onChange={handlePopulateHubChange}
        placeholder={PROMPT_PLACEHOLDER}
        knownTokens={populateHubTokens}
        readOnlyFromIndex={populateHubReadOnlyStart}
        showSectionDividers
        aria-label="Populate AI prompt bundle editor"
      />
      {renderPromptHelp(populateHubTokens)}

      <p className={styles['prompt-linked-hint']}>
        One combined prompt is sent to AI on auto-fill. Edit the Populate section here; edit
        Description and Category in the sidebar (they update in this snippet automatically).
      </p>
    </>
  );

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

              <div className={styles['prompts-section']}>
                <h3 className={styles['prompts-section-title']}>Prompts</h3>

                <div className={styles['prompt-category']}>
                  <div className={styles['prompt-category-label']}>Item</div>

                  <div className={styles['prompt-layout']}>
                    <nav className={styles['prompt-subnav']} aria-label="Item prompt types">
                      <button
                        type="button"
                        className={`${styles['prompt-subnav-item']} ${
                          promptType === 'review' ? styles['prompt-subnav-item-active'] : ''
                        }`}
                        aria-current={promptType === 'review' ? 'page' : undefined}
                        onClick={() => setPromptType('review')}
                      >
                        {getPromptItem('review').label}
                      </button>

                      <button
                        type="button"
                        className={`${styles['prompt-subnav-item']} ${
                          promptType === 'import' ? styles['prompt-subnav-item-active'] : ''
                        }`}
                        aria-current={promptType === 'import' ? 'page' : undefined}
                        onClick={() => setPromptType('import')}
                      >
                        {getPromptItem('import').label}
                      </button>

                      <div
                        className={`${styles['prompt-subnav-group']} ${
                          isPopulateGroupActive ? styles['prompt-subnav-group-active'] : ''
                        }`}
                        role="group"
                        aria-label="Populate prompts"
                      >
                        <button
                          type="button"
                          className={`${styles['prompt-subnav-item']} ${styles['prompt-subnav-parent']} ${
                            promptType === 'populate' ? styles['prompt-subnav-item-active'] : ''
                          }`}
                          aria-current={promptType === 'populate' ? 'page' : undefined}
                          onClick={() => setPromptType('populate')}
                        >
                          {populatePromptItem.label}
                        </button>

                        <div className={styles['prompt-subnav-nested']}>
                          {POPULATE_GROUP_CHILDREN.map((childId) => {
                            const child = getPromptItem(childId);
                            return (
                              <button
                                key={child.id}
                                type="button"
                                className={`${styles['prompt-subnav-item']} ${styles['prompt-subnav-nested-item']} ${
                                  promptType === child.id ? styles['prompt-subnav-item-active'] : ''
                                }`}
                                aria-current={promptType === child.id ? 'page' : undefined}
                                onClick={() => setPromptType(child.id)}
                              >
                                {child.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </nav>

                    <div className={styles['prompt-panel']}>
                      {promptType === 'populate' ? (
                        <>
                          <div className={styles['prompt-panel-header']}>
                            <p className={styles['prompt-panel-description']}>{activePrompt.description}</p>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              iconOnly
                              className={styles['prompt-reset-btn']}
                              leftIcon={<RotateCcw size={12} />}
                              onClick={() => onResetPrompt('populate')}
                              disabled={!aiDefaultPrompts || populateIsAtDefault}
                              aria-label="Reset populate prompt to default"
                              title="Reset populate prompt to default"
                            />
                          </div>
                          {renderPopulateHub()}
                        </>
                      ) : (
                        <>
                          <div className={styles['prompt-panel-header']}>
                            <p className={styles['prompt-panel-description']}>{activePrompt.description}</p>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              iconOnly
                              className={styles['prompt-reset-btn']}
                              leftIcon={<RotateCcw size={12} />}
                              onClick={() => onResetPrompt(promptType)}
                              disabled={!aiDefaultPrompts || isAtDefault}
                              aria-label="Reset to default"
                              title="Reset to default"
                            />
                          </div>
                          <PromptCodeEditor
                            value={promptValue}
                            onChange={setPromptValue}
                            placeholder={PROMPT_PLACEHOLDER}
                            knownTokens={activePrompt.tokens}
                            aria-label={`${activePrompt.label} AI prompt editor`}
                          />
                          {renderPromptHelp(activePrompt.tokens)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AiSectionTemplate;
