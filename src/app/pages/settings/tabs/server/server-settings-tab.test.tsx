import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({
    user: { Id: 'admin-id', IsAdmin: true, IsOwner: true },
    checkSystemStatus: vi.fn(),
  }),
}));

vi.mock('core/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('features/system/api/system.api', () => ({
  systemApi: {
    checkAiConnection: vi.fn(),
    listModels: vi.fn(),
    listMetadataPacks: vi.fn(),
  },
}));

import { ServerSettingsTab } from './server-settings-tab.component';
import { apiClient } from 'core/api/client';
import { systemApi } from 'features/system/api/system.api';
import { writeLocalAiModelsCache } from './utils/local-ai-models-cache.util';

const showToast = vi.fn();
const LOCAL_ENDPOINT = 'http://localhost:11434/v1';

function localModelOptions(ids: string[]) {
  return ids.map((id) => ({
    id,
    name: id,
    company: 'Local',
    displayName: id,
  }));
}

function mockLocalModels(ids: string[]) {
  vi.mocked(systemApi.listModels).mockResolvedValue(localModelOptions(ids));
}

const mockMetadataPacksCatalog = [
  {
    Id: 'technology',
    Label: 'Technology',
    Description: 'Extra specs for electronics and computers.',
    Fields: [{ Key: 'Brand', Label: 'Brand' }],
    PromptFragment: 'Technology rules.',
    Children: [
      {
        Id: 'technology.cpu',
        Label: 'CPU',
        Description: 'Processor cores, clocks, and socket.',
        Fields: [
          { Key: 'Cores', Label: 'Cores' },
          { Key: 'Threads', Label: 'Threads' },
        ],
        PromptFragment: 'CPU rules.',
      },
      {
        Id: 'technology.computer-parts',
        Label: 'Computer parts',
        Description: 'Form factor, interface, and wattage.',
        Fields: [{ Key: 'FormFactor', Label: 'Form factor' }],
        PromptFragment: 'Computer parts rules.',
      },
    ],
  },
];

function mockMetadataPacks() {
  vi.mocked(systemApi.listMetadataPacks).mockResolvedValue({
    Catalog: mockMetadataPacksCatalog,
    EnabledPackIds: ['technology', 'technology.cpu'],
  });
}

const mockAiDefaultPrompts = {
  Review: 'Default review prompt text',
  Description: 'Default description prompt text',
  Populate: 'Default populate prompt with Oura Ring 5 title rules',
  Category: 'Default category prompt text',
  Import: 'Default import prompt text',
};

const defaultSettings = {
  DbType: 'local' as const,
  DbUrl: '',
  SmtpType: 'local' as const,
  SmtpHost: '',
  SmtpPort: 1025,
  SmtpUser: '',
  SmtpPass: '',
  SmtpSecure: false,
  SmtpFrom: 'noreply@giftistry.local',
  NtfyEnabled: false,
  NtfyBaseUrl: 'https://ntfy.sh',
  NtfyAuthToken: '',
  NtfyTopicPrefix: 'giftistry',
  WebPushEnabled: false,
  WebPushVapidPublicKey: '',
  WebPushVapidPrivateKey: '',
  WebPushSubject: 'mailto:admin@localhost',
  FcmEnabled: false,
  FcmProjectId: '',
  FcmServiceAccountJson: '',
  AiEnabled: true,
  AiFastProvider: 'local' as const,
  AiFastEndpoint: '',
  AiFastApiKey: '',
  AiFastModel: 'llama3',
  AiIntelligentProvider: 'local' as const,
  AiIntelligentEndpoint: '',
  AiIntelligentApiKey: '',
  AiIntelligentModel: 'llama3',
  AiRateLimitEnabled: false,
  AiCompletionTimeoutMs: 600000,
  AiConnectTimeoutMs: 5000,
  ScrapeFetchTimeoutMs: 8000,
  ScrapePlaywrightTimeoutMs: 25000,
  GrabInfoConcurrency: 3,
  GrabInfoConcurrencyUnlimited: false,
  GrabInfoActiveStreamLimit: 16,
  AiPrompt: '',
  AiDescriptionPrompt: '',
  AiPopulatePrompt: '',
  AiCategoryPrompt: '',
  AiDefaultPrompts: mockAiDefaultPrompts,
  AiEnabledPackIds: ['technology', 'technology.cpu'],
};

function getLocalModelSelect() {
  return screen.getByLabelText('Discovered models') as HTMLSelectElement;
}

function getLocalModelInput() {
  return screen.getByLabelText('Model', { selector: 'input' }) as HTMLInputElement;
}

function expectAiCheckPayload(
  endpoint: string,
  slot: 'fast' | 'intelligent',
  models: { fast: string; intelligent: string }
) {
  expect(systemApi.checkAiConnection).toHaveBeenCalledWith({
    AiProvider: 'local',
    AiEndpoint: endpoint,
    AiApiKey: null,
    AiModelSlot: slot,
    AiFastModel: models.fast || null,
    AiIntelligentModel: models.intelligent || null,
  });
}

describe('ServerSettingsTab local AI validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({ ...defaultSettings });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
    mockLocalModels([]);
    mockMetadataPacks();
  });

  test('does not check AI connection on page load and hides model until endpoint is available', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
    });

    expect(systemApi.checkAiConnection).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('Model')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Discovered models')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Intelligent' }));
    expect(screen.queryByLabelText('Model')).not.toBeInTheDocument();
  });

  test('shows AI rate-limit toggle and dual-model recommendations after local endpoint connects', async () => {
    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected',
      Models: ['llama3'],
    });
    mockLocalModels(['llama3']);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Enable AI rate limiting')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Enable AI rate limiting')).not.toBeChecked();

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Recommended for ~8B \/ fast processing \(import, grab info\)/i)
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Intelligent' }));
    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Recommended for ~27B \/ deep research and reviews/i)
      ).toBeInTheDocument();
    });
  });

  test('loads and saves scrape timeout settings', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      ScrapeFetchTimeoutMs: 12000,
      ScrapePlaywrightTimeoutMs: 45000,
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Fetch scrape timeout in milliseconds')).toHaveValue(12000);
    });
    expect(screen.getByLabelText('Playwright scrape timeout in milliseconds')).toHaveValue(45000);

    fireEvent.change(screen.getByLabelText('Fetch scrape timeout in milliseconds'), {
      target: { value: '15000' },
    });
    fireEvent.change(screen.getByLabelText('Playwright scrape timeout in milliseconds'), {
      target: { value: '50000' },
    });

    const form = screen.getByLabelText('Save changes').closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const postCall = vi.mocked(apiClient.post).mock.calls.find(
      (call) => call[0] === '/api/system/settings'
    );
    expect(postCall).toBeDefined();
    expect(postCall![1]).toMatchObject({
      ScrapeFetchTimeoutMs: 15000,
      ScrapePlaywrightTimeoutMs: 50000,
    });
  });

  test('loads and saves grab info parallelism settings', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      GrabInfoConcurrency: 12,
      GrabInfoConcurrencyUnlimited: false,
      GrabInfoActiveStreamLimit: 24,
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Concurrent Grab info workers')).toHaveValue(12);
    });
    expect(screen.getByLabelText('Max visible Grab info stream lanes')).toHaveValue(24);
    expect(screen.getByLabelText('Unlimited Grab info concurrency')).not.toBeChecked();

    fireEvent.change(screen.getByLabelText('Concurrent Grab info workers'), {
      target: { value: '8' },
    });
    fireEvent.change(screen.getByLabelText('Max visible Grab info stream lanes'), {
      target: { value: '32' },
    });

    const form = screen.getByLabelText('Save changes').closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const postCall = vi.mocked(apiClient.post).mock.calls.find(
      (call) => call[0] === '/api/system/settings'
    );
    expect(postCall).toBeDefined();
    expect(postCall![1]).toMatchObject({
      GrabInfoConcurrency: 8,
      GrabInfoConcurrencyUnlimited: false,
      GrabInfoActiveStreamLimit: 32,
    });
  });

  test('unlimited concurrency confirm cancel keeps toggle off and workers enabled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Concurrent Grab info workers')).toHaveValue(3);
    });

    fireEvent.click(screen.getByLabelText('Unlimited Grab info concurrency'));

    expect(confirmSpy).toHaveBeenCalled();
    expect(screen.getByLabelText('Unlimited Grab info concurrency')).not.toBeChecked();
    expect(screen.getByLabelText('Concurrent Grab info workers')).not.toBeDisabled();

    confirmSpy.mockRestore();
  });

  test('unlimited concurrency confirm OK enables toggle and disables workers input', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Concurrent Grab info workers')).toHaveValue(3);
    });

    fireEvent.click(screen.getByLabelText('Unlimited Grab info concurrency'));

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Unlimited Grab info concurrency will scrape every remaining product URL/i)
    );
    expect(screen.getByLabelText('Unlimited Grab info concurrency')).toBeChecked();
    expect(screen.getByLabelText('Concurrent Grab info workers')).toBeDisabled();

    const form = screen.getByLabelText('Save changes').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const postCall = vi.mocked(apiClient.post).mock.calls.find(
      (call) => call[0] === '/api/system/settings'
    );
    expect(postCall![1]).toMatchObject({
      GrabInfoConcurrency: 3,
      GrabInfoConcurrencyUnlimited: true,
    });

    confirmSpy.mockRestore();
  });

  test('loads and saves AI completion timeout setting', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiCompletionTimeoutMs: 300000,
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('AI request timeout in milliseconds')).toHaveValue(300000);
    });

    fireEvent.change(screen.getByLabelText('AI request timeout in milliseconds'), {
      target: { value: '900000' },
    });

    const form = screen.getByLabelText('Save changes').closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const postCall = vi.mocked(apiClient.post).mock.calls.find(
      (call) => call[0] === '/api/system/settings'
    );
    expect(postCall).toBeDefined();
    expect(postCall![1]).toMatchObject({
      AiCompletionTimeoutMs: 900000,
    });
  });

  test('loads and saves AI connect timeout setting', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiConnectTimeoutMs: 3000,
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByLabelText('AI connect timeout in milliseconds')).toHaveValue(3000);
    });

    fireEvent.change(screen.getByLabelText('AI connect timeout in milliseconds'), {
      target: { value: '8000' },
    });

    const form = screen.getByLabelText('Save changes').closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const postCall = vi.mocked(apiClient.post).mock.calls.find(
      (call) => call[0] === '/api/system/settings'
    );
    expect(postCall).toBeDefined();
    expect(postCall![1]).toMatchObject({
      AiConnectTimeoutMs: 8000,
    });
  });

  test('populates model dropdown after successful endpoint check', async () => {
    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected to local AI',
      Models: ['llama3', 'qwen3:8b'],
    });
    mockLocalModels(['llama3', 'qwen3:8b']);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('http://localhost:11434/v1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expectAiCheckPayload(LOCAL_ENDPOINT, 'fast', { fast: 'llama3', intelligent: 'llama3' });
    });

    await waitFor(() => {
      expect(systemApi.listModels).toHaveBeenCalledWith({
        provider: 'local',
        endpoint: LOCAL_ENDPOINT,
        apiKey: null,
      });
    });

    await waitFor(() => {
      const select = getLocalModelSelect();
      expect(select).toHaveValue('llama3');
      expect(Array.from(select.options).map((option) => option.text)).toEqual([
        'llama3',
        'qwen3:8b',
        'Custom model…',
      ]);
      expect(screen.queryByLabelText('Model', { selector: 'input' })).not.toBeInTheDocument();
    });

    expect(screen.getByRole('status', { name: 'Connected to local AI · 2 models found' })).toBeInTheDocument();
  });

  test('selecting a listed model updates the dropdown value', async () => {
    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected',
      Models: ['llama3', 'qwen3:8b'],
    });
    mockLocalModels(['llama3', 'qwen3:8b']);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('http://localhost:11434/v1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('llama3');
    });

    fireEvent.change(getLocalModelSelect(), { target: { value: 'qwen3:8b' } });

    expect(getLocalModelSelect()).toHaveValue('qwen3:8b');
  });

  test('choosing Custom model reveals text input', async () => {
    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected',
      Models: ['llama3', 'qwen3:8b'],
    });
    mockLocalModels(['llama3', 'qwen3:8b']);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('http://localhost:11434/v1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('llama3');
    });

    fireEvent.change(getLocalModelSelect(), { target: { value: '__custom__' } });

    expect(getLocalModelSelect()).toHaveValue('__custom__');
    expect(getLocalModelInput()).toBeInTheDocument();
    expect(getLocalModelInput()).toHaveValue('llama3');
  });

  test('shows error status when local AI connection check fails', async () => {
    vi.mocked(systemApi.checkAiConnection).mockRejectedValue(
      new Error('Cannot reach AI server at http://localhost:11434/v1')
    );

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('http://localhost:11434/v1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('status', { name: 'Cannot reach AI server at http://localhost:11434/v1' })
      ).toBeInTheDocument();
    });
  });

  test('hydrates model dropdown from cache without calling ai-check', async () => {
    writeLocalAiModelsCache(LOCAL_ENDPOINT, ['llama3', 'qwen3:8b']);

    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiFastEndpoint: LOCAL_ENDPOINT,
      AiIntelligentEndpoint: LOCAL_ENDPOINT,
      AiFastModel: 'qwen3:8b',
      AiIntelligentModel: 'qwen3:8b',
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('qwen3:8b');
    });

    expect(screen.queryByLabelText('Model', { selector: 'input' })).not.toBeInTheDocument();
    expect(Array.from(getLocalModelSelect().options).map((option) => option.text)).toEqual([
      'llama3',
      'qwen3:8b',
      'Custom model…',
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Intelligent' }));
    expect(getLocalModelSelect()).toHaveValue('qwen3:8b');
    expect(systemApi.checkAiConnection).not.toHaveBeenCalled();
  });

  test('changing endpoint clears dropdown until a new check succeeds', async () => {
    writeLocalAiModelsCache(LOCAL_ENDPOINT, ['llama3', 'qwen3:8b']);

    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiFastEndpoint: LOCAL_ENDPOINT,
      AiIntelligentEndpoint: LOCAL_ENDPOINT,
      AiFastModel: 'qwen3:8b',
      AiIntelligentModel: 'qwen3:8b',
    });

    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected',
      Models: ['mistral'],
    });
    mockLocalModels(['mistral']);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('qwen3:8b');
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: 'http://localhost:11435/v1' },
    });

    await waitFor(() => {
      expect(screen.queryByLabelText('Discovered models')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Model')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expectAiCheckPayload('http://localhost:11435/v1', 'fast', {
        fast: 'qwen3:8b',
        intelligent: 'qwen3:8b',
      });
    });

    await waitFor(() => {
      expect(systemApi.listModels).toHaveBeenCalledWith({
        provider: 'local',
        endpoint: 'http://localhost:11435/v1',
        apiKey: null,
      });
    });

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('__custom__');
      expect(getLocalModelInput()).toHaveValue('qwen3:8b');
    });
  });
});

describe('ServerSettingsTab OpenRouter models proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiFastProvider: 'openrouter',
      AiIntelligentProvider: 'openrouter',
      AiFastModel: 'google/gemini-2.0-flash',
      AiIntelligentModel: 'google/gemini-2.0-flash',
    });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
    mockMetadataPacks();
  });

  test('loads OpenRouter models via systemApi.listModels and never calls openrouter.ai', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    vi.mocked(systemApi.listModels).mockResolvedValue([
      {
        id: 'google/gemini-2.0-flash',
        name: 'Google: Gemini 2.0 Flash',
        company: 'Google',
        displayName: 'Gemini 2.0 Flash',
      },
    ]);

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(systemApi.listModels).toHaveBeenCalledWith({ provider: 'openrouter' });
    });

    const openRouterFetchCalls = fetchSpy.mock.calls.filter(([input]) =>
      String(input).includes('openrouter.ai')
    );
    expect(openRouterFetchCalls).toHaveLength(0);

    fetchSpy.mockRestore();
  });
});

describe('ServerSettingsTab AI default prompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({ ...defaultSettings });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
    mockLocalModels([]);
    mockMetadataPacks();
  });

  test('prefills populate editor with the populate body on load', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Populate' })).toHaveAttribute('aria-current', 'true');
    });

    expect(await screen.findByLabelText('Populate AI prompt editor')).toHaveValue(
      mockAiDefaultPrompts.Populate
    );
    expect(screen.queryByLabelText('Populate AI prompt bundle editor')).not.toBeInTheDocument();
  });

  test('reset to default restores the populate body', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    const textarea = await screen.findByLabelText('Populate AI prompt editor');
    fireEvent.change(textarea, { target: { value: 'Custom edited populate prompt' } });

    await waitFor(() => {
      expect(textarea).toHaveValue('Custom edited populate prompt');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset populate prompt to default' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Populate AI prompt editor')).toHaveValue(
        mockAiDefaultPrompts.Populate
      );
    });
  });

  test('Auto-Description is a separate prompt and does not rewrite Populate', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Auto-Description' }));

    const descriptionEditor = await screen.findByLabelText('Auto-Description AI prompt editor');
    fireEvent.change(descriptionEditor, { target: { value: 'Updated description prompt text' } });

    fireEvent.click(screen.getByRole('button', { name: 'Populate' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Populate AI prompt editor')).toHaveValue(
        mockAiDefaultPrompts.Populate
      );
    });
  });
});

describe('ServerSettingsTab AI disable persists config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiEnabled: true,
      AiWebSearchEnabled: true,
      AiRateLimitEnabled: true,
      AiFastProvider: 'openrouter',
      AiFastEndpoint: 'https://openrouter.ai/api/v1',
      AiFastApiKey: 'sk-keep-me',
      AiFastModel: 'google/gemini-2.0-flash',
      AiIntelligentProvider: 'openrouter',
      AiIntelligentEndpoint: 'https://openrouter.ai/api/v1',
      AiIntelligentApiKey: 'sk-keep-intelligent',
      AiIntelligentModel: 'anthropic/claude-sonnet-4',
      AiPopulatePrompt: 'Keep this populate prompt',
      AiDescriptionPrompt: 'Keep this description prompt',
    });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
    mockLocalModels([]);
    mockMetadataPacks();
  });

  test('disabling AI still saves prompts, keys, and provider settings', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    const enableAi = await screen.findByLabelText('Enable AI assistant integration');
    expect(enableAi).toBeChecked();
    fireEvent.click(enableAi);
    expect(enableAi).not.toBeChecked();

    const form = screen.getByLabelText('Save changes').closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });

    const postCall = vi.mocked(apiClient.post).mock.calls.find(
      (call) => call[0] === '/api/system/settings'
    );
    expect(postCall![1]).toMatchObject({
      AiEnabled: false,
      AiWebSearchEnabled: true,
      AiRateLimitEnabled: true,
      AiFastProvider: 'openrouter',
      AiFastEndpoint: 'https://openrouter.ai/api/v1',
      AiFastApiKey: 'sk-keep-me',
      AiFastModel: 'google/gemini-2.0-flash',
      AiIntelligentProvider: 'openrouter',
      AiIntelligentEndpoint: 'https://openrouter.ai/api/v1',
      AiIntelligentApiKey: 'sk-keep-intelligent',
      AiIntelligentModel: 'anthropic/claude-sonnet-4',
      AiPopulatePrompt: 'Keep this populate prompt',
      AiDescriptionPrompt: 'Keep this description prompt',
    });
  });
});

describe('ServerSettingsTab metadata packs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({ ...defaultSettings });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
    mockLocalModels([]);
    mockMetadataPacks();
  });

  async function submitSettings() {
    const form = screen.getByLabelText('Save changes').closest('form');
    fireEvent.submit(form!);
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
    });
    return vi.mocked(apiClient.post).mock.calls.find((call) => call[0] === '/api/system/settings');
  }

  test('directory lists Technology, CPU, and Computer parts', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));

    expect(await screen.findByRole('heading', { name: 'Packs' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Toggle Technology' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Toggle CPU' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Toggle Computer parts' })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'View CPU' })).toBeInTheDocument();
  });

  test('View opens pack detail with fields and a read-only fragment', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('button', { name: 'View CPU' }));

    expect(await screen.findByRole('heading', { name: 'CPU' })).toBeInTheDocument();
    expect(screen.getByText('Cores')).toBeInTheDocument();
    expect(screen.getByText('Threads')).toBeInTheDocument();
    const fragment = screen.getByLabelText('CPU prompt fragment') as HTMLTextAreaElement;
    expect(fragment).toHaveValue('CPU rules.');
    expect(fragment).toHaveAttribute('readonly');
  });

  test('removing CPU saves without the CPU pack id', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Toggle CPU' }));

    const postCall = await submitSettings();
    expect(postCall![1]).toMatchObject({
      AiEnabledPackIds: [],
    });
  });

  test('adding Computer parts includes the parent and that child', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Toggle Computer parts' }));

    const postCall = await submitSettings();
    expect(postCall![1]).toMatchObject({
      AiEnabledPackIds: ['technology', 'technology.cpu', 'technology.computer-parts'],
    });
  });

  test('removing CPU while Computer parts stays keeps the parent', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('checkbox', { name: 'Toggle Computer parts' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Toggle CPU' }));

    const postCall = await submitSettings();
    expect(postCall![1]).toMatchObject({
      AiEnabledPackIds: ['technology', 'technology.computer-parts'],
    });
  });

  test('directory lists built-in packs, custom packs, and Create Pack', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiEnabledPackIds: ['technology', 'technology.cpu', 'custom.books'],
      AiCustomPacks: [
        {
          Id: 'custom.books',
          Label: 'Books',
          Description: 'Book specs',
          Match: { Categories: [] },
          Fields: [{ Key: 'Binding', Label: 'Binding', Bucket: 'userDefined' }],
          PromptFragment: 'Extract binding.',
        },
      ],
    });

    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));

    expect(await screen.findByRole('heading', { name: 'Packs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Pack' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Toggle Technology' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Toggle Books' })).toBeChecked();
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Books' })).toBeInTheDocument();
  });

  test('creating a pack enables it locally and includes it in the save payload', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create Pack' }));

    fireEvent.change(screen.getByLabelText('Label'), { target: { value: 'Books' } });
    fireEvent.change(screen.getByLabelText('Create pack prompt fragment editor'), {
      target: { value: 'Extract binding.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add pack' }));

    expect(await screen.findByRole('heading', { name: 'Books' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Toggle Books' })).toBeChecked();

    const postCall = await submitSettings();
    expect(postCall![1]).toMatchObject({
      AiEnabledPackIds: ['technology', 'technology.cpu', 'custom.books'],
      AiCustomPacks: [
        expect.objectContaining({
          Id: 'custom.books',
          Label: 'Books',
          PromptFragment: 'Extract binding.',
        }),
      ],
    });
  });

  test('custom fragment is editable and built-in fragment stays readonly', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiEnabledPackIds: ['technology', 'technology.cpu', 'custom.books'],
      AiCustomPacks: [
        {
          Id: 'custom.books',
          Label: 'Books',
          Description: 'Book specs',
          Match: { Categories: [] },
          Fields: [],
          PromptFragment: 'Extract binding.',
        },
      ],
    });

    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('button', { name: 'View CPU' }));

    const cpuFragment = await screen.findByLabelText('CPU prompt fragment');
    expect(cpuFragment).toHaveAttribute('readonly');

    fireEvent.click(screen.getByRole('button', { name: 'Back to packs' }));
    fireEvent.click(await screen.findByRole('button', { name: 'View Books' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }));

    const editor = await screen.findByLabelText('Edit Books prompt fragment editor');
    expect(editor).not.toHaveAttribute('readonly');
    fireEvent.change(editor, { target: { value: 'Updated book rules.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply changes' }));

    const postCall = await submitSettings();
    expect(postCall![1].AiCustomPacks[0].PromptFragment).toBe('Updated book rules.');
  });

  test('deleting a custom pack drops it from the payload and enabled ids', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiEnabledPackIds: ['technology', 'technology.cpu', 'custom.books'],
      AiCustomPacks: [
        {
          Id: 'custom.books',
          Label: 'Books',
          Description: 'Book specs',
          Match: { Categories: [] },
          Fields: [],
          PromptFragment: 'Extract binding.',
        },
      ],
    });

    render(<ServerSettingsTab showToast={showToast} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Packs' }));
    fireEvent.click(await screen.findByRole('button', { name: 'View Books' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Delete' }));

    expect(await screen.findByRole('heading', { name: 'Packs' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'View Books' })).not.toBeInTheDocument();

    const postCall = await submitSettings();
    expect(postCall![1]).toMatchObject({
      AiEnabledPackIds: ['technology', 'technology.cpu'],
      AiCustomPacks: [],
    });
  });
});
