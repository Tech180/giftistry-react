import { describe, expect, test } from 'vitest';
import type { SettingsPayloadInput } from '../interfaces/settings-payload-input.interface';
import { buildSettingsPayload } from './build-settings-payload.util';

const baseInput = (): SettingsPayloadInput => ({
  dbType: 'local',
  dbUrl: '',
  publicAppUrl: ' https://app.example.com ',
  oauthEnabled: false,
  oauthIssuerUrl: '',
  oauthClientId: '',
  oauthClientSecret: '',
  oauthButtonText: '',
  oauthAutoRegister: true,
  smtpType: 'local',
  smtpHost: 'smtp.example.com',
  smtpPort: '587',
  smtpUser: 'user',
  smtpPass: 'pass',
  smtpSecure: true,
  smtpFrom: 'custom@example.com',
  ntfyEnabled: false,
  ntfyBaseUrl: ' https://ntfy.sh ',
  ntfyAuthToken: '',
  ntfyTopicPrefix: '',
  webPushEnabled: false,
  webPushVapidPublicKey: '',
  webPushVapidPrivateKey: '',
  webPushSubject: '',
  fcmEnabled: false,
  fcmProjectId: '',
  fcmServiceAccountJson: '',
  aiEnabled: false,
  aiWebSearchEnabled: false,
  aiRateLimitEnabled: false,
  aiImportChunkingEnabled: true,
  aiImportChunkItemLimit: 20,
  aiCompletionTimeoutMs: 600000,
  aiConnectTimeoutMs: 5000,
  scrapeFetchTimeoutMs: 8000,
  scrapePlaywrightTimeoutMs: 25000,
  grabInfoConcurrency: 3,
  grabInfoConcurrencyUnlimited: false,
  grabInfoActiveStreamLimit: 16,
  aiFastProvider: 'openrouter',
  aiFastEndpoint: '',
  aiFastApiKey: '',
  aiFastModel: '',
  aiIntelligentProvider: 'openrouter',
  aiIntelligentEndpoint: '',
  aiIntelligentApiKey: '',
  aiIntelligentModel: '',
  aiPrompt: '',
  aiDescriptionPrompt: '',
  aiPopulatePrompt: '',
  aiCategoryPrompt: '',
  aiImportPrompt: '',
  aiEnabledPackIds: [],
  aiCustomPacks: [],
  allowSetup: true,
});

describe('buildSettingsPayload', () => {
  test('includes remote db url and clears it for local', () => {
    const remote = buildSettingsPayload({
      ...baseInput(),
      dbType: 'remote',
      dbUrl: 'postgres://example',
    });
    expect(remote.DbType).toBe('remote');
    expect(remote.DbUrl).toBe('postgres://example');

    const local = buildSettingsPayload({
      ...baseInput(),
      dbType: 'local',
      dbUrl: 'postgres://example',
    });
    expect(local.DbType).toBe('local');
    expect(local.DbUrl).toBe('');
  });

  test('uses remote smtp fields and local smtp defaults', () => {
    const remote = buildSettingsPayload({
      ...baseInput(),
      smtpType: 'remote',
    });
    expect(remote.SmtpHost).toBe('smtp.example.com');
    expect(remote.SmtpPort).toBe(587);
    expect(remote.SmtpUser).toBe('user');
    expect(remote.SmtpPass).toBe('pass');
    expect(remote.SmtpSecure).toBe(true);
    expect(remote.SmtpFrom).toBe('custom@example.com');

    const local = buildSettingsPayload(baseInput());
    expect(local.SmtpHost).toBe('');
    expect(local.SmtpPort).toBe(1025);
    expect(local.SmtpUser).toBe('');
    expect(local.SmtpPass).toBe('');
    expect(local.SmtpSecure).toBe(false);
    expect(local.SmtpFrom).toBe('noreply@giftistry.local');
  });
});
