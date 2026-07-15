import React from 'react';
import { EnterPanel, Button } from 'shared/ui';
import { Save } from 'lucide-react';
import { ServerSettingsTabTemplateProps } from './interfaces/server-settings-tab-template-props.interface';
import styles from './server-settings-tab.module.css';
import { DbSection } from './components/db-section/db-section.component';
import { SmtpSection } from './components/smtp-section/smtp-section.component';
import { ScrapeSection } from './components/scrape-section/scrape-section.component';
import { AiSection } from './components/ai-section/ai-section.component';

export const ServerSettingsTabTemplate: React.FC<ServerSettingsTabTemplateProps> = ({
  dbType,
  setDbType,
  dbUrl,
  setDbUrl,
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
  isServerOwner,
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
              iconOnly
              isLoading={isSaving}
              leftIcon={<Save size={16} />}
              aria-label={isSaving ? 'Saving changes' : 'Save changes'}
              title={isSaving ? 'Saving changes' : 'Save changes'}
            />
          </div>
        </div>

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
        />
      </form>

      {isServerOwner && (
        <section className={styles['danger-zone']}>
            <h2 className={styles['danger-zone-title']}>Delete server</h2>
            <p className={styles['danger-zone-desc']}>
              Permanently delete this Giftistry instance and all user data.
            </p>
            <Button variant="danger" size="sm" onClick={onDeleteServer} isLoading={isDeletingServer}>
              Delete server
            </Button>
          </section>
      )}
    </EnterPanel>
  );
};

export default ServerSettingsTabTemplate;
