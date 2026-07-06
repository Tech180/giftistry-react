import React from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { Switch } from 'shared/ui';
import { AiSectionProps } from '../../interfaces/ai-section-props.interface';
import styles from './ai-section.module.css';

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
}) => {
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
              {/* Model Provider Tabs */}
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
                {/* Organization & Model Row */}
                <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                  {/* Company (Only for OpenRouter) */}
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
                            const firstModel = openrouterModels.find(m => m.company === newCompany);
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

                  {/* Model Name */}
                  <div className={styles['input-group']}>
                    <label className={styles['input-label']}>Model Name</label>
                    {aiProvider !== 'local' ? (
                      <div className={styles['select-box']}>
                        <select
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
                      <input
                        type="text"
                        className={styles['input-field']}
                        placeholder="llama3"
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* API Key & Endpoint Row */}
                <div className={styles['form-row']} style={{ gridColumn: '1 / -1' }}>
                  {/* API Key */}
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

                  {/* API Endpoint */}
                  <div className={styles['input-group']}>
                    <label className={styles['input-label']}>
                      API Endpoint URL
                    </label>
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
                  </div>
                </div>

                {/* Custom Review Prompt */}
                <div className={styles['input-wrapper']} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles['input-label']}>Custom Review Prompt</label>
                  <textarea
                    className={`${styles['input-field']} ${styles['textarea-field']}`}
                    rows={6}
                    placeholder="Leave blank to use default expert shopping reviewer prompt template."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <span className={styles['help-text']}>
                    Use the following dynamic tokens:
                    <code>{"{itemName}"}</code>, 
                    <code>{"{category}"}</code>, 
                    <code>{"{url}"}</code>, and 
                    <code>{"{pageContext}"}</code>.
                  </span>
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
