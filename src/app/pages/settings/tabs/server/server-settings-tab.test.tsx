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
  },
}));

import { ServerSettingsTab } from './server-settings-tab.component';
import { apiClient } from 'core/api/client';
import { systemApi } from 'features/system/api/system.api';
import { writeLocalAiModelsCache } from './utils/local-ai-models-cache.util';
import { assemblePopulateHubPrompt } from './utils/populate-hub-prompt.util';

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
  });

  test('prefills populate bundle editor with combined prompt on load', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Populate' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Populate' }));

    const expectedBundle = assemblePopulateHubPrompt(
      mockAiDefaultPrompts.Populate,
      mockAiDefaultPrompts.Description,
      mockAiDefaultPrompts.Category
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Populate AI prompt bundle editor')).toHaveValue(
        expectedBundle
      );
    });

    const bundleEditor = screen.getByLabelText(
      'Populate AI prompt bundle editor'
    ) as HTMLTextAreaElement;
    expect(bundleEditor.value).toContain('=== Description ===');
    expect(bundleEditor.value).toContain('=== Category ===');
  });

  test('reset to default restores populate body in bundle editor', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Populate' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Populate' }));

    const textarea = await screen.findByLabelText('Populate AI prompt bundle editor');
    fireEvent.change(textarea, { target: { value: 'Custom edited populate prompt' } });

    await waitFor(() => {
      expect(textarea).toHaveValue(
        assemblePopulateHubPrompt(
          'Custom edited populate prompt',
          mockAiDefaultPrompts.Description,
          mockAiDefaultPrompts.Category
        )
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset populate prompt to default' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Populate AI prompt bundle editor')).toHaveValue(
        assemblePopulateHubPrompt(
          mockAiDefaultPrompts.Populate,
          mockAiDefaultPrompts.Description,
          mockAiDefaultPrompts.Category
        )
      );
    });
  });

  test('editing Description tab updates linked section in populate bundle', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Description' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Description' }));

    const descriptionEditor = await screen.findByLabelText('Description AI prompt editor');
    fireEvent.change(descriptionEditor, { target: { value: 'Updated description prompt text' } });

    fireEvent.click(screen.getByRole('button', { name: 'Populate' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Populate AI prompt bundle editor')).toHaveValue(
        assemblePopulateHubPrompt(
          mockAiDefaultPrompts.Populate,
          'Updated description prompt text',
          mockAiDefaultPrompts.Category
        )
      );
    });
  });
});
