import React from 'react';
import { EnterPanel, Button } from 'shared/ui';
import { Save } from 'lucide-react';
import { ServerSettingsTabTemplateProps } from './interfaces/server-settings-tab-template-props.interface';
import styles from './server-settings-tab.module.css';
import { DbSection } from './components/db-section/db-section.component';
import { SmtpSection } from './components/smtp-section/smtp-section.component';
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

        {/* AI Integration Section */}
        <AiSection
          aiEnabled={aiEnabled}
          setAiEnabled={setAiEnabled}
          aiProvider={aiProvider}
          setAiProvider={setAiProvider}
          aiApiKey={aiApiKey}
          setAiApiKey={setAiApiKey}
          aiModel={aiModel}
          setAiModel={setAiModel}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          aiEndpoint={aiEndpoint}
          setAiEndpoint={setAiEndpoint}
          showAiKey={showAiKey}
          setShowAiKey={setShowAiKey}
          openrouterModels={openrouterModels}
          isLoadingModels={isLoadingModels}
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          filteredModels={filteredModels}
        />
      </form>
    </EnterPanel>
  );
};

export default ServerSettingsTabTemplate;
