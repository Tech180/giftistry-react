import React from 'react';
import { EnterPanel, Button, Switch } from 'shared/ui';
import { Save } from 'lucide-react';
import { ServerSettingsTabTemplateProps } from './interfaces/server-settings-tab-template-props.interface';
import styles from './server-settings-tab.module.css';
import { DbSection } from './components/db-section/db-section.component';
import { SmtpSection } from './components/smtp-section/smtp-section.component';
import { ScrapeSection } from './components/scrape-section/scrape-section.component';
import { AiSection } from './components/ai-section/ai-section.component';
import dbStyles from './components/db-section/db-section.module.css';

export const ServerSettingsTabTemplate: React.FC<ServerSettingsTabTemplateProps> = ({
  dbType,
  setDbType,
  dbUrl,
  setDbUrl,
  publicAppUrl,
  setPublicAppUrl,
  oauthEnabled,
  setOauthEnabled,
  oauthIssuerUrl,
  setOauthIssuerUrl,
  oauthClientId,
  setOauthClientId,
  oauthClientSecret,
  setOauthClientSecret,
  oauthButtonText,
  setOauthButtonText,
  oauthAutoRegister,
  setOauthAutoRegister,
  smtpType,
  setSmtpType,
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  smtpUser,
  setSmtpUser,
  smtpPass,
  setSmtpPass,
  smtpSecure,
  setSmtpSecure,
  smtpFrom,
  setSmtpFrom,
  showPassword,
  setShowPassword,
  isLoading,
  isSaving,
  handleSave,
  aiEnabled,
  setAiEnabled,
  aiWebSearchEnabled,
  setAiWebSearchEnabled,
  aiRateLimitEnabled,
  setAiRateLimitEnabled,
  aiCompletionTimeoutMs,
  setAiCompletionTimeoutMs,
  scrapeFetchTimeoutMs,
  setScrapeFetchTimeoutMs,
  scrapePlaywrightTimeoutMs,
  setScrapePlaywrightTimeoutMs,
  grabInfoConcurrency,
  setGrabInfoConcurrency,
  grabInfoConcurrencyUnlimited,
  setGrabInfoConcurrencyUnlimited,
  grabInfoActiveStreamLimit,
  setGrabInfoActiveStreamLimit,
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
  allowSetup,
  onAllowSetupChange,
  isSavingAllowSetup,
  onDeleteServer,
  isDeletingServer,
}) => {
  if (isLoading) {
    return (
      <EnterPanel animation="fade" className={styles['tab-pane']} style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <span className={`${styles.spinner} animate-spin`} style={{ width: '32px', height: '32px', color: 'var(--primary)' }}></span>
      </EnterPanel>
    );
  }

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <form onSubmit={handleSave} className={styles['settings-container']}>
        <div className={styles['page-header']}>
          <div>
            <h2 className={styles['page-title']}>Server Configuration</h2>
            <p className={styles['page-subtitle']}>Configure database connection settings and mail delivery options for this homelab instance.</p>
          </div>
          <div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save size={16} />}
              aria-label={isSaving ? 'Saving changes' : 'Save changes'}
              title={isSaving ? 'Saving changes' : 'Save changes'}
            >
              Save
            </Button>
          </div>
        </div>

        <section className={dbStyles.section}>
          <h2 className={dbStyles['section-header']}>Public App URL</h2>
          <div className={dbStyles['setting-list']}>
            <div className={dbStyles['setting-row']}>
              <div className={dbStyles['setting-info']}>
                <span className={dbStyles['setting-label']}>Browser-facing URL</span>
                <span className={dbStyles['setting-desc']}>
                  Used for transactional emails, CORS, and WebAuthn. No trailing slash.
                </span>
              </div>
              <div className={`${dbStyles['setting-action']} ${dbStyles['setting-action-wide']} ${dbStyles['input-wrapper']}`}>
                <div className={dbStyles['input-box']}>
                  <input
                    type="url"
                    className={dbStyles['input-field']}
                    placeholder="https://giftistry.example.com"
                    value={publicAppUrl}
                    onChange={(e) => setPublicAppUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={dbStyles.section}>
          <h2 className={dbStyles['section-header']}>Single Sign-On (OIDC)</h2>
          <div className={dbStyles['setting-list']}>
            <div className={dbStyles['setting-row']}>
              <div className={dbStyles['setting-info']}>
                <span className={dbStyles['setting-label']}>Enable OAuth login</span>
                <span className={dbStyles['setting-desc']}>Shows an SSO button on the login page.</span>
              </div>
              <div className={dbStyles['setting-action']}>
                <Switch
                  checked={oauthEnabled}
                  onChange={setOauthEnabled}
                  aria-label="Enable OAuth login"
                />
              </div>
            </div>
            {oauthEnabled && (
              <>
                <div className={dbStyles['setting-row']}>
                  <div className={dbStyles['setting-info']}>
                    <span className={dbStyles['setting-label']}>Issuer URL</span>
                  </div>
                  <div className={`${dbStyles['setting-action']} ${dbStyles['setting-action-wide']} ${dbStyles['input-wrapper']}`}>
                    <div className={dbStyles['input-box']}>
                      <input
                        className={dbStyles['input-field']}
                        value={oauthIssuerUrl}
                        onChange={(e) => setOauthIssuerUrl(e.target.value)}
                        placeholder="https://auth.example.com"
                      />
                    </div>
                  </div>
                </div>
                <div className={dbStyles['setting-row']}>
                  <div className={dbStyles['setting-info']}>
                    <span className={dbStyles['setting-label']}>Client ID</span>
                  </div>
                  <div className={`${dbStyles['setting-action']} ${dbStyles['setting-action-wide']} ${dbStyles['input-wrapper']}`}>
                    <div className={dbStyles['input-box']}>
                      <input
                        className={dbStyles['input-field']}
                        value={oauthClientId}
                        onChange={(e) => setOauthClientId(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className={dbStyles['setting-row']}>
                  <div className={dbStyles['setting-info']}>
                    <span className={dbStyles['setting-label']}>Client secret</span>
                    <span className={dbStyles['setting-desc']}>Or set OAUTH_CLIENT_SECRET in the environment.</span>
                  </div>
                  <div className={`${dbStyles['setting-action']} ${dbStyles['setting-action-wide']} ${dbStyles['input-wrapper']}`}>
                    <div className={dbStyles['input-box']}>
                      <input
                        type="password"
                        className={dbStyles['input-field']}
                        value={oauthClientSecret}
                        onChange={(e) => setOauthClientSecret(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className={dbStyles['setting-row']}>
                  <div className={dbStyles['setting-info']}>
                    <span className={dbStyles['setting-label']}>Button text</span>
                  </div>
                  <div className={`${dbStyles['setting-action']} ${dbStyles['setting-action-wide']} ${dbStyles['input-wrapper']}`}>
                    <div className={dbStyles['input-box']}>
                      <input
                        className={dbStyles['input-field']}
                        value={oauthButtonText}
                        onChange={(e) => setOauthButtonText(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className={dbStyles['setting-row']}>
                  <div className={dbStyles['setting-info']}>
                    <span className={dbStyles['setting-label']}>Auto-register new SSO users</span>
                  </div>
                  <div className={dbStyles['setting-action']}>
                    <Switch
                      checked={oauthAutoRegister}
                      onChange={setOauthAutoRegister}
                      aria-label="Auto-register new SSO users"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Database Configuration Section */}
        <DbSection
          dbType={dbType}
          setDbType={setDbType}
          dbUrl={dbUrl}
          setDbUrl={setDbUrl}
        />

        {/* SMTP Mail Server Section */}
        <SmtpSection
          smtpType={smtpType}
          setSmtpType={setSmtpType}
          smtpHost={smtpHost}
          setSmtpHost={setSmtpHost}
          smtpPort={smtpPort}
          setSmtpPort={setSmtpPort}
          smtpUser={smtpUser}
          setSmtpUser={setSmtpUser}
          smtpPass={smtpPass}
          setSmtpPass={setSmtpPass}
          smtpSecure={smtpSecure}
          setSmtpSecure={setSmtpSecure}
          smtpFrom={smtpFrom}
          setSmtpFrom={setSmtpFrom}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <ScrapeSection
          scrapeFetchTimeoutMs={scrapeFetchTimeoutMs}
          setScrapeFetchTimeoutMs={setScrapeFetchTimeoutMs}
          scrapePlaywrightTimeoutMs={scrapePlaywrightTimeoutMs}
          setScrapePlaywrightTimeoutMs={setScrapePlaywrightTimeoutMs}
          grabInfoConcurrency={grabInfoConcurrency}
          setGrabInfoConcurrency={setGrabInfoConcurrency}
          grabInfoConcurrencyUnlimited={grabInfoConcurrencyUnlimited}
          setGrabInfoConcurrencyUnlimited={setGrabInfoConcurrencyUnlimited}
          grabInfoActiveStreamLimit={grabInfoActiveStreamLimit}
          setGrabInfoActiveStreamLimit={setGrabInfoActiveStreamLimit}
        />

        {/* AI Integration Section */}
        <AiSection
          aiEnabled={aiEnabled}
          setAiEnabled={setAiEnabled}
          aiWebSearchEnabled={aiWebSearchEnabled}
          setAiWebSearchEnabled={setAiWebSearchEnabled}
          aiRateLimitEnabled={aiRateLimitEnabled}
          setAiRateLimitEnabled={setAiRateLimitEnabled}
          aiCompletionTimeoutMs={aiCompletionTimeoutMs}
          setAiCompletionTimeoutMs={setAiCompletionTimeoutMs}
          aiFastProvider={aiFastProvider}
          setAiFastProvider={setAiFastProvider}
          aiFastEndpoint={aiFastEndpoint}
          setAiFastEndpoint={setAiFastEndpoint}
          aiFastApiKey={aiFastApiKey}
          setAiFastApiKey={setAiFastApiKey}
          aiFastModel={aiFastModel}
          setAiFastModel={setAiFastModel}
          aiIntelligentProvider={aiIntelligentProvider}
          setAiIntelligentProvider={setAiIntelligentProvider}
          aiIntelligentEndpoint={aiIntelligentEndpoint}
          setAiIntelligentEndpoint={setAiIntelligentEndpoint}
          aiIntelligentApiKey={aiIntelligentApiKey}
          setAiIntelligentApiKey={setAiIntelligentApiKey}
          aiIntelligentModel={aiIntelligentModel}
          setAiIntelligentModel={setAiIntelligentModel}
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
          showFastAiKey={showFastAiKey}
          setShowFastAiKey={setShowFastAiKey}
          showIntelligentAiKey={showIntelligentAiKey}
          setShowIntelligentAiKey={setShowIntelligentAiKey}
          openrouterModels={openrouterModels}
          isLoadingModels={isLoadingModels}
          companies={companies}
          selectedFastCompany={selectedFastCompany}
          setSelectedFastCompany={setSelectedFastCompany}
          selectedIntelligentCompany={selectedIntelligentCompany}
          setSelectedIntelligentCompany={setSelectedIntelligentCompany}
          filteredFastModels={filteredFastModels}
          filteredIntelligentModels={filteredIntelligentModels}
          localFastModels={localFastModels}
          localIntelligentModels={localIntelligentModels}
          localFastModelMode={localFastModelMode}
          localIntelligentModelMode={localIntelligentModelMode}
          onLocalModelSelection={onLocalModelSelection}
          fastConnectionStatus={fastConnectionStatus}
          fastConnectionMessage={fastConnectionMessage}
          intelligentConnectionStatus={intelligentConnectionStatus}
          intelligentConnectionMessage={intelligentConnectionMessage}
          onTestAiConnection={onTestAiConnection}
          aiEnabledPackIds={aiEnabledPackIds}
          onEnabledPackIdsChange={onEnabledPackIdsChange}
          aiCustomPacks={aiCustomPacks}
          onCustomPacksChange={onCustomPacksChange}
        />
      </form>

      <section className={styles['danger-zone']}>
        <h2 className={styles['danger-zone-title']}>Danger zone</h2>
        <p className={styles['danger-zone-desc']}>
          Controls that can reopen first-run setup or permanently erase this instance.
        </p>

        <div className={styles['danger-zone-list']}>
          <div className={styles['danger-zone-row']}>
            <div className={styles['danger-zone-info']}>
              <span className={styles['danger-zone-label']}>Allow first-run setup</span>
              <span className={styles['danger-zone-hint']}>
                When enabled, the setup wizard is available if this instance has no users (for
                example after Delete server). After a successful setup it seals again automatically.
              </span>
            </div>
            <div className={styles['danger-zone-action']}>
              <Switch
                checked={allowSetup}
                onChange={onAllowSetupChange}
                disabled={isSavingAllowSetup}
                aria-label="Allow first-run setup"
              />
            </div>
          </div>

          <div className={styles['danger-zone-row']}>
            <div className={styles['danger-zone-info']}>
              <span className={styles['danger-zone-label']}>Delete server</span>
              <span className={styles['danger-zone-hint']}>
                Permanently delete this Giftistry instance and all user data.
              </span>
            </div>
            <div className={styles['danger-zone-action']}>
              <Button
                variant="danger"
                size="sm"
                onClick={onDeleteServer}
                isLoading={isDeletingServer}
              >
                Delete server
              </Button>
            </div>
          </div>
        </div>
      </section>
    </EnterPanel>
  );
};

export default ServerSettingsTabTemplate;
