import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Loader2, RotateCcw } from 'lucide-react';
import { Switch, Button } from 'shared/ui';
import { AiSectionProps } from '../../interfaces/ai-section-props.interface';
import {
  LOCAL_AI_CUSTOM_MODEL_VALUE,
  isModelInLocalList,
} from '../../interfaces/local-ai-model.interface';
import type { PromptType } from '../../utils/ai-prompt-settings.util';
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
    id: 'description',
    label: 'Description',
    description: 'AI Summarize notes in the add-item form.',
    tokens: ['{itemName}', '{category}', '{url}', '{price}', '{websiteName}', '{existingNotes}', '{itemContext}'],
  },
  {
    id: 'populate',
    label: 'Populate',
    description: 'Auto-fill item fields from a product URL (wand button). Includes title-cleaning rules for marketplace listings.',
    tokens: ['{url}', '{websiteName}', '{pageContext}', '{itemName}'],
  },
  {
    id: 'category',
    label: 'Category',
    description: 'Classify items into tailored categories when auto-filling from a URL.',
    tokens: ['{url}', '{websiteName}', '{pageContext}', '{itemName}'],
  },
];

export const AiSectionTemplate: React.FC<AiSectionProps> = ({
  aiEnabled,
  setAiEnabled,
  aiProvider,
  setAiProvider,
  aiApiKey,
  setAiApiKey,
  aiModel,
  setAiModel,
  aiPrompt,
  setAiPrompt,
  aiDescriptionPrompt,
  setAiDescriptionPrompt,
  aiPopulatePrompt,
  setAiPopulatePrompt,
  aiCategoryPrompt,
  setAiCategoryPrompt,
  aiDefaultPrompts,
  onResetPrompt,
  aiEndpoint,
  setAiEndpoint,
  showAiKey,
  setShowAiKey,
  openrouterModels,
  isLoadingModels,
  companies,
  selectedCompany,
  setSelectedCompany,
  filteredModels,
  localAiModels,
  localModelMode,
  onLocalModelSelection,
  aiConnectionStatus,
  aiConnectionMessage,
  onTestAiConnection,
  isTestingAiConnection,
}) => {
  const localModelSelectValue =
    localModelMode === 'custom'
      ? LOCAL_AI_CUSTOM_MODEL_VALUE
      : isModelInLocalList(aiModel, localAiModels)
        ? aiModel
        : '';

  const localModelSelectDisabled = isTestingAiConnection;

  const [promptType, setPromptType] = useState<PromptType>('review');
  const activePrompt = PROMPT_ITEMS.find((item) => item.id === promptType) ?? PROMPT_ITEMS[0];

  const promptValue =
    promptType === 'review'
      ? aiPrompt
      : promptType === 'description'
        ? aiDescriptionPrompt
        : promptType === 'populate'
          ? aiPopulatePrompt
          : aiCategoryPrompt;

  const setPromptValue = (value: string) => {
    if (promptType === 'review') {
      setAiPrompt(value);
    } else if (promptType === 'description') {
      setAiDescriptionPrompt(value);
    } else if (promptType === 'populate') {
      setAiPopulatePrompt(value);
    } else {
      setAiCategoryPrompt(value);
    }
  };

  const defaultPromptValue = aiDefaultPrompts
    ? promptType === 'review'
      ? aiDefaultPrompts.Review
      : promptType === 'description'
        ? aiDefaultPrompts.Description
        : promptType === 'populate'
          ? aiDefaultPrompts.Populate
          : aiDefaultPrompts.Category
    : '';

  const isAtDefault = Boolean(aiDefaultPrompts) && promptValue === defaultPromptValue;

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
              <div className={styles['connection-section']}>
                <h3 className={styles['subsection-title']}>Connection</h3>

                <div className={styles['tab-container']}>
                  <button
                    type="button"
                    className={`${styles['tab-button']} ${aiProvider === 'local' ? styles['tab-button-active'] : ''}`}
                    onClick={() => setAiProvider('local')}
                  >
                    Local Instance
                  </button>
                  <button
                    type="button"
                    className={`${styles['tab-button']} ${aiProvider !== 'local' ? styles['tab-button-active'] : ''}`}
                    onClick={() => setAiProvider('openrouter')}
                  >
                    Global Models (API)
                  </button>
                </div>

                <div className={styles['form-grid']}>
                  <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                    {aiProvider !== 'local' && (
                      <div className={styles['input-group']}>
                        <label className={styles['input-label']}>Company</label>
                        <div className={styles['select-box']}>
                          <select
                            className={styles['input-field']}
                            value={selectedCompany}
                            onChange={(e) => {
                              const newCompany = e.target.value;
                              setSelectedCompany(newCompany);
                              const firstModel = openrouterModels.find((m) => m.company === newCompany);
                              if (firstModel) {
                                setAiModel(firstModel.id);
                              }
                            }}
                            disabled={isLoadingModels}
                          >
                            {isLoadingModels ? (
                              <option value="">Loading companies...</option>
                            ) : (
                              <>
                                <option value="">Select a company...</option>
                                {companies.map((company) => (
                                  <option key={company} value={company}>
                                    {company}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className={styles['input-group']}>
                      <label
                        className={styles['input-label']}
                        htmlFor={
                          aiProvider === 'local'
                            ? localAiModels.length > 0 && localModelMode === 'listed'
                              ? 'ai-model-select'
                              : 'ai-model-input'
                            : 'ai-model-select'
                        }
                      >
                        Model Name
                      </label>
                      {aiProvider !== 'local' ? (
                        <div className={styles['select-box']}>
                          <select
                            id="ai-model-select"
                            className={styles['input-field']}
                            value={aiModel}
                            onChange={(e) => setAiModel(e.target.value)}
                            required={aiEnabled}
                            disabled={isLoadingModels || !selectedCompany}
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
                      ) : (
                        <div className={styles['local-model-row']}>
                          {localAiModels.length > 0 && (
                            <div
                              className={`${styles['select-box']} ${
                                localModelMode === 'listed' ? styles['local-model-select-full'] : ''
                              }`}
                            >
                              <select
                                id="ai-model-select"
                                className={styles['input-field']}
                                value={localModelSelectValue}
                                onChange={(e) => onLocalModelSelection(e.target.value)}
                                disabled={localModelSelectDisabled}
                                aria-label="Discovered models"
                              >
                                {isTestingAiConnection ? (
                                  <option value={LOCAL_AI_CUSTOM_MODEL_VALUE}>Discovering models…</option>
                                ) : (
                                  <>
                                    {localAiModels.map((modelId) => (
                                      <option key={modelId} value={modelId}>
                                        {modelId}
                                      </option>
                                    ))}
                                    <option value={LOCAL_AI_CUSTOM_MODEL_VALUE}>Custom model…</option>
                                  </>
                                )}
                              </select>
                            </div>
                          )}
                          {(localAiModels.length === 0 || localModelMode === 'custom') && (
                            <input
                              type="text"
                              id="ai-model-input"
                              className={styles['input-field']}
                              placeholder="llama3"
                              value={aiModel}
                              onChange={(e) => setAiModel(e.target.value)}
                              disabled={isTestingAiConnection}
                              aria-label="Model Name"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles['input-group']}>
                      <label className={styles['input-label']}>
                        {aiProvider === 'local' ? 'API Key' : 'API Key *'}
                      </label>
                      <div className={styles['input-box']}>
                        <input
                          type={showAiKey ? 'text' : 'password'}
                          className={styles['input-field']}
                          placeholder="Secret"
                          value={aiApiKey}
                          onChange={(e) => setAiApiKey(e.target.value)}
                          required={aiEnabled && aiProvider !== 'local'}
                        />
                        <button
                          type="button"
                          className={styles['input-icon-btn']}
                          onClick={() => setShowAiKey(!showAiKey)}
                        >
                          {showAiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className={styles['input-group']}>
                      <div className={styles['input-label-row']}>
                        <label className={styles['input-label']}>API Endpoint URL</label>
                        {aiProvider === 'local' && aiConnectionStatus !== 'idle' && (
                          <span
                            className={`${styles['connection-status-icon']} ${
                              aiConnectionStatus === 'success'
                                ? styles['connection-status-success']
                                : aiConnectionStatus === 'error'
                                  ? styles['connection-status-error']
                                  : styles['connection-status-checking']
                            }`}
                            title={aiConnectionMessage}
                            aria-label={aiConnectionMessage}
                            role="status"
                          >
                            {aiConnectionStatus === 'success' && <CheckCircle2 size={14} />}
                            {aiConnectionStatus === 'error' && <AlertCircle size={14} />}
                            {aiConnectionStatus === 'checking' && (
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
                            aiProvider === 'local' ? 'http://localhost:11434/v1' : 'https://api.openai.com/v1'
                          }
                          value={aiEndpoint}
                          onChange={(e) => setAiEndpoint(e.target.value)}
                          required={aiEnabled && aiProvider === 'local'}
                        />
                        {aiProvider === 'local' && (
                          <button
                            type="button"
                            className={styles['refresh-connection-btn']}
                            onClick={onTestAiConnection}
                            disabled={isTestingAiConnection || !aiEndpoint.trim()}
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
                </div>
              </div>

              <div className={styles['prompts-section']}>
                <h3 className={styles['prompts-section-title']}>Prompts</h3>

                <div className={styles['prompt-category']}>
                  <div className={styles['prompt-category-label']}>Item</div>

                  <div className={styles['prompt-layout']}>
                    <nav className={styles['prompt-subnav']} aria-label="Item prompt types">
                      {PROMPT_ITEMS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`${styles['prompt-subnav-item']} ${
                            promptType === item.id ? styles['prompt-subnav-item-active'] : ''
                          }`}
                          aria-current={promptType === item.id ? 'page' : undefined}
                          onClick={() => setPromptType(item.id)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </nav>

                    <div className={styles['prompt-panel']}>
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
                      <span className={styles['help-text']}>
                        Dynamic tokens are highlighted in the editor. Available for this prompt:{' '}
                        {activePrompt.tokens.map((token, index) => (
                          <React.Fragment key={token}>
                            <code className={styles['help-token']}>{token}</code>
                            {index < activePrompt.tokens.length - 1 ? ', ' : '.'}
                          </React.Fragment>
                        ))}
                      </span>
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
