import React from 'react';
import { EnterPanel, Button } from 'shared/ui';
import { Save } from 'lucide-react';
import { ServerTemplateProps } from './interfaces/template-props.interface';
import styles from './page.module.css';
import { PublicUrl } from './components/public-url/public-url.component';
import { Oauth } from './components/oauth/oauth.component';
import { DbSection } from './components/db-section/db-section.component';
import { SmtpSection } from './components/smtp-section/smtp-section.component';
import { PushSection } from './components/push-section/push-section.component';
import { ScrapeSection } from './components/scrape-section/scrape-section.component';
import { AiSection } from './components/ai-section/ai-section.component';
import { DangerZone } from './components/danger-zone/danger-zone.component';

export const ServerTemplate: React.FC<ServerTemplateProps> = ({
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
  ntfyEnabled,
  setNtfyEnabled,
  ntfyBaseUrl,
  setNtfyBaseUrl,
  ntfyAuthToken,
  setNtfyAuthToken,
  ntfyTopicPrefix,
  setNtfyTopicPrefix,
  webPushEnabled,
  setWebPushEnabled,
  webPushVapidPublicKey,
  setWebPushVapidPublicKey,
  webPushVapidPrivateKey,
  setWebPushVapidPrivateKey,
  webPushSubject,
  setWebPushSubject,
  fcmEnabled,
  setFcmEnabled,
  fcmProjectId,
  setFcmProjectId,
  fcmServiceAccountJson,
  setFcmServiceAccountJson,
  onTestNtfy,
  isTestingNtfy,
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
  aiImportChunkingEnabled,
  setAiImportChunkingEnabled,
  aiImportChunkItemLimit,
  setAiImportChunkItemLimit,
  aiConnectTimeoutMs,
  setAiConnectTimeoutMs,
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
      <EnterPanel animation="fade" className={styles['page']} style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <span className={`${styles['page__spinner']} animate-spin`} style={{ width: '32px', height: '32px', color: 'var(--primary)' }}></span>
      </EnterPanel>
    );
  }

  return (
    <EnterPanel animation="fade" className={styles['page']}>
      <form onSubmit={handleSave} className={styles['page__form']}>
        <div className={styles['page__header']}>
          <div>
            <h2 className={styles['page__title']}>Server Configuration</h2>
            <p className={styles['page__subtitle']}>Configure database connection settings and mail delivery options for this homelab instance.</p>
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

        <PublicUrl
          publicAppUrl = {
            publicAppUrl
          }
          setPublicAppUrl = {
            setPublicAppUrl
          }
        />

        <Oauth
          oauthEnabled = {
            oauthEnabled
          }
          setOauthEnabled = {
            setOauthEnabled
          }
          oauthIssuerUrl = {
            oauthIssuerUrl
          }
          setOauthIssuerUrl = {
            setOauthIssuerUrl
          }
          oauthClientId = {
            oauthClientId
          }
          setOauthClientId = {
            setOauthClientId
          }
          oauthClientSecret = {
            oauthClientSecret
          }
          setOauthClientSecret = {
            setOauthClientSecret
          }
          oauthAutoRegister = {
            oauthAutoRegister
          }
          setOauthAutoRegister = {
            setOauthAutoRegister
          }
        />

        <DbSection
          dbType = {
            dbType
          }
          setDbType = {
            setDbType
          }
          dbUrl = {
            dbUrl
          }
          setDbUrl = {
            setDbUrl
          }
        />

        <SmtpSection
          smtpType = {
            smtpType
          }
          setSmtpType = {
            setSmtpType
          }
          smtpHost = {
            smtpHost
          }
          setSmtpHost = {
            setSmtpHost
          }
          smtpPort = {
            smtpPort
          }
          setSmtpPort = {
            setSmtpPort
          }
          smtpUser = {
            smtpUser
          }
          setSmtpUser = {
            setSmtpUser
          }
          smtpPass = {
            smtpPass
          }
          setSmtpPass = {
            setSmtpPass
          }
          smtpSecure = {
            smtpSecure
          }
          setSmtpSecure = {
            setSmtpSecure
          }
          smtpFrom = {
            smtpFrom
          }
          setSmtpFrom = {
            setSmtpFrom
          }
          showPassword = {
            showPassword
          }
          setShowPassword = {
            setShowPassword
          }
        />

        <PushSection
          ntfyEnabled = {
            ntfyEnabled
          }
          setNtfyEnabled = {
            setNtfyEnabled
          }
          ntfyBaseUrl = {
            ntfyBaseUrl
          }
          setNtfyBaseUrl = {
            setNtfyBaseUrl
          }
          ntfyAuthToken = {
            ntfyAuthToken
          }
          setNtfyAuthToken = {
            setNtfyAuthToken
          }
          ntfyTopicPrefix = {
            ntfyTopicPrefix
          }
          setNtfyTopicPrefix = {
            setNtfyTopicPrefix
          }
          webPushEnabled = {
            webPushEnabled
          }
          setWebPushEnabled = {
            setWebPushEnabled
          }
          webPushVapidPublicKey = {
            webPushVapidPublicKey
          }
          setWebPushVapidPublicKey = {
            setWebPushVapidPublicKey
          }
          webPushVapidPrivateKey = {
            webPushVapidPrivateKey
          }
          setWebPushVapidPrivateKey = {
            setWebPushVapidPrivateKey
          }
          webPushSubject = {
            webPushSubject
          }
          setWebPushSubject = {
            setWebPushSubject
          }
          fcmEnabled = {
            fcmEnabled
          }
          setFcmEnabled = {
            setFcmEnabled
          }
          fcmProjectId = {
            fcmProjectId
          }
          setFcmProjectId = {
            setFcmProjectId
          }
          fcmServiceAccountJson = {
            fcmServiceAccountJson
          }
          setFcmServiceAccountJson = {
            setFcmServiceAccountJson
          }
          onTestNtfy = {
            onTestNtfy
          }
          isTestingNtfy = {
            isTestingNtfy
          }
        />

        <ScrapeSection
          scrapeFetchTimeoutMs = {
            scrapeFetchTimeoutMs
          }
          setScrapeFetchTimeoutMs = {
            setScrapeFetchTimeoutMs
          }
          scrapePlaywrightTimeoutMs = {
            scrapePlaywrightTimeoutMs
          }
          setScrapePlaywrightTimeoutMs = {
            setScrapePlaywrightTimeoutMs
          }
          grabInfoConcurrency = {
            grabInfoConcurrency
          }
          setGrabInfoConcurrency = {
            setGrabInfoConcurrency
          }
          grabInfoConcurrencyUnlimited = {
            grabInfoConcurrencyUnlimited
          }
          setGrabInfoConcurrencyUnlimited = {
            setGrabInfoConcurrencyUnlimited
          }
          grabInfoActiveStreamLimit = {
            grabInfoActiveStreamLimit
          }
          setGrabInfoActiveStreamLimit = {
            setGrabInfoActiveStreamLimit
          }
        />

        <AiSection
          aiEnabled = {
            aiEnabled
          }
          setAiEnabled = {
            setAiEnabled
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
          aiFastProvider = {
            aiFastProvider
          }
          setAiFastProvider = {
            setAiFastProvider
          }
          aiFastEndpoint = {
            aiFastEndpoint
          }
          setAiFastEndpoint = {
            setAiFastEndpoint
          }
          aiFastApiKey = {
            aiFastApiKey
          }
          setAiFastApiKey = {
            setAiFastApiKey
          }
          aiFastModel = {
            aiFastModel
          }
          setAiFastModel = {
            setAiFastModel
          }
          aiIntelligentProvider = {
            aiIntelligentProvider
          }
          setAiIntelligentProvider = {
            setAiIntelligentProvider
          }
          aiIntelligentEndpoint = {
            aiIntelligentEndpoint
          }
          setAiIntelligentEndpoint = {
            setAiIntelligentEndpoint
          }
          aiIntelligentApiKey = {
            aiIntelligentApiKey
          }
          setAiIntelligentApiKey = {
            setAiIntelligentApiKey
          }
          aiIntelligentModel = {
            aiIntelligentModel
          }
          setAiIntelligentModel = {
            setAiIntelligentModel
          }
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
          showFastAiKey = {
            showFastAiKey
          }
          setShowFastAiKey = {
            setShowFastAiKey
          }
          showIntelligentAiKey = {
            showIntelligentAiKey
          }
          setShowIntelligentAiKey = {
            setShowIntelligentAiKey
          }
          openrouterModels = {
            openrouterModels
          }
          isLoadingModels = {
            isLoadingModels
          }
          companies = {
            companies
          }
          selectedFastCompany = {
            selectedFastCompany
          }
          setSelectedFastCompany = {
            setSelectedFastCompany
          }
          selectedIntelligentCompany = {
            selectedIntelligentCompany
          }
          setSelectedIntelligentCompany = {
            setSelectedIntelligentCompany
          }
          filteredFastModels = {
            filteredFastModels
          }
          filteredIntelligentModels = {
            filteredIntelligentModels
          }
          localFastModels = {
            localFastModels
          }
          localIntelligentModels = {
            localIntelligentModels
          }
          localFastModelMode = {
            localFastModelMode
          }
          localIntelligentModelMode = {
            localIntelligentModelMode
          }
          onLocalModelSelection = {
            onLocalModelSelection
          }
          fastConnectionStatus = {
            fastConnectionStatus
          }
          fastConnectionMessage = {
            fastConnectionMessage
          }
          intelligentConnectionStatus = {
            intelligentConnectionStatus
          }
          intelligentConnectionMessage = {
            intelligentConnectionMessage
          }
          onTestAiConnection = {
            onTestAiConnection
          }
          aiEnabledPackIds = {
            aiEnabledPackIds
          }
          onEnabledPackIdsChange = {
            onEnabledPackIdsChange
          }
          aiCustomPacks = {
            aiCustomPacks
          }
          onCustomPacksChange = {
            onCustomPacksChange
          }
        />
      </form>

      <DangerZone
        allowSetup = {
          allowSetup
        }
        onAllowSetupChange = {
          onAllowSetupChange
        }
        isSavingAllowSetup = {
          isSavingAllowSetup
        }
        onDeleteServer = {
          onDeleteServer
        }
        isDeletingServer = {
          isDeletingServer
        }
      />
    </EnterPanel>
  );
};

export default ServerTemplate;
