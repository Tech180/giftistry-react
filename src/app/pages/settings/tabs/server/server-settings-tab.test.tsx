import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ user: { Id: 'admin-id', IsAdmin: true, IsOwner: true } }),
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
  },
}));

import { ServerSettingsTab } from './server-settings-tab.component';
import { apiClient } from 'core/api/client';
import { systemApi } from 'features/system/api/system.api';
import { writeLocalAiModelsCache } from './utils/local-ai-models-cache.util';

const showToast = vi.fn();
const LOCAL_ENDPOINT = 'http://localhost:11434/v1';

const mockAiDefaultPrompts = {
  Review: 'Default review prompt text',
  Description: 'Default description prompt text',
  Populate: 'Default populate prompt with Oura Ring 5 title rules',
  Category: 'Default category prompt text',
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
  AiProvider: 'local' as const,
  AiApiKey: '',
  AiModel: 'llama3',
  AiPrompt: '',
  AiDescriptionPrompt: '',
  AiPopulatePrompt: '',
  AiCategoryPrompt: '',
  AiEndpoint: '',
  AiDefaultPrompts: mockAiDefaultPrompts,
};

function getLocalModelSelect() {
  return screen.getByLabelText('Discovered models');
}

function getLocalModelInput() {
  return screen.getByLabelText('Model Name', { selector: 'input' });
}

describe('ServerSettingsTab local AI validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({ ...defaultSettings });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
  });

  test('does not check AI connection on page load', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalled();
    });

    expect(systemApi.checkAiConnection).not.toHaveBeenCalled();
    expect(getLocalModelInput()).toHaveValue('llama3');
    expect(screen.queryByLabelText('Discovered models')).not.toBeInTheDocument();
  });

  test('populates model dropdown after successful endpoint check', async () => {
    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected to local AI',
      Models: ['llama3', 'qwen3:8b'],
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('http://localhost:11434/v1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: LOCAL_ENDPOINT },
    });

    await waitFor(() => {
      expect(systemApi.checkAiConnection).toHaveBeenCalledWith({
        AiProvider: 'local',
        AiEndpoint: LOCAL_ENDPOINT,
        AiApiKey: null,
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
      expect(screen.queryByLabelText('Model Name', { selector: 'input' })).not.toBeInTheDocument();
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
      AiEndpoint: LOCAL_ENDPOINT,
      AiModel: 'qwen3:8b',
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('qwen3:8b');
    });

    expect(screen.queryByLabelText('Model Name', { selector: 'input' })).not.toBeInTheDocument();
    expect(Array.from(getLocalModelSelect().options).map((option) => option.text)).toEqual([
      'llama3',
      'qwen3:8b',
      'Custom model…',
    ]);
    expect(systemApi.checkAiConnection).not.toHaveBeenCalled();
  });

  test('changing endpoint clears dropdown until a new check succeeds', async () => {
    writeLocalAiModelsCache(LOCAL_ENDPOINT, ['llama3', 'qwen3:8b']);

    vi.mocked(apiClient.get).mockResolvedValue({
      ...defaultSettings,
      AiEndpoint: LOCAL_ENDPOINT,
      AiModel: 'qwen3:8b',
    });

    vi.mocked(systemApi.checkAiConnection).mockResolvedValue({
      Reachable: true,
      ModelAvailable: true,
      Working: true,
      Message: 'Connected',
      Models: ['mistral'],
    });

    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('qwen3:8b');
    });

    fireEvent.change(screen.getByPlaceholderText('http://localhost:11434/v1'), {
      target: { value: 'http://localhost:11435/v1' },
    });

    await waitFor(() => {
      expect(screen.queryByLabelText('Discovered models')).not.toBeInTheDocument();
      expect(getLocalModelInput()).toHaveValue('qwen3:8b');
    });

    await waitFor(() => {
      expect(systemApi.checkAiConnection).toHaveBeenCalledWith({
        AiProvider: 'local',
        AiEndpoint: 'http://localhost:11435/v1',
        AiApiKey: null,
      });
    });

    await waitFor(() => {
      expect(getLocalModelSelect()).toHaveValue('__custom__');
      expect(getLocalModelInput()).toHaveValue('qwen3:8b');
    });
  });
});

describe('ServerSettingsTab AI default prompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiClient.get).mockResolvedValue({ ...defaultSettings });
    vi.mocked(apiClient.post).mockResolvedValue({ success: true });
  });

  test('prefills populate textarea with default prompt on load', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Populate' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Populate' }));

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockAiDefaultPrompts.Populate)).toBeInTheDocument();
    });
  });

  test('reset to default restores populate textarea content', async () => {
    render(<ServerSettingsTab showToast={showToast} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Populate' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Populate' }));

    const textarea = await screen.findByDisplayValue(mockAiDefaultPrompts.Populate);
    fireEvent.change(textarea, { target: { value: 'Custom edited populate prompt' } });
    expect(screen.getByDisplayValue('Custom edited populate prompt')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset to default' }));

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockAiDefaultPrompts.Populate)).toBeInTheDocument();
    });
  });
});
