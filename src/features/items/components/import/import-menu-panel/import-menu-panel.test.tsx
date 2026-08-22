import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ImportMenuPanel } from './import-menu-panel.component';

const canShowAiRef = { current: true };

vi.mock('features/jobs', async () => {
  const actual = await vi.importActual<typeof import('features/jobs')>('features/jobs');
  return {
    ...actual,
    jobsApi: {
      startWishlistImport: vi.fn(),
      getJob: vi.fn(),
      cancelJob: vi.fn(),
    },
  };
});

vi.mock('features/items/utils/read-import-file.util', () => ({
  readImportFile: vi.fn(async (file: File, options?: { onProgress?: (n: number) => void; allowAi?: boolean }) => {
    options?.onProgress?.(40);
    options?.onProgress?.(100);
    if (!options?.allowAi && file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Unsupported file type. Use CSV, XLSX, TXT, or JSON.');
    }
    return {
      fileName: file.name,
      format: file.name.toLowerCase().endsWith('.pdf') ? ('pdf' as const) : ('json' as const),
      content: '{}',
      contentEncoding: 'text' as const,
    };
  }),
}));

vi.mock('app/providers/toast-context', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

vi.mock('app/providers/auth-context', () => ({
  useAuth: () => ({ canShowAi: canShowAiRef.current }),
}));

vi.mock('app/providers/user-socket-context', () => ({
  useUserSocket: () => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    isConnected: true,
  }),
}));

import { jobsApi } from 'features/jobs';

function renderPanel(
  overrides: Partial<React.ComponentProps<typeof ImportMenuPanel>> = {}
) {
  const onClose = vi.fn();
  const onSizeChange = vi.fn();
  const onImported = vi.fn();
  const setPanelEscapeHandler = vi.fn();

  const result = render(
    <ImportMenuPanel
      mode="create-list"
      allowAi
      onClose={onClose}
      onSizeChange={onSizeChange}
      onImported={onImported}
      setPanelEscapeHandler={setPanelEscapeHandler}
      {...overrides}
    />
  );

  return { ...result, onClose, onSizeChange, onImported, setPanelEscapeHandler };
}

async function selectFile(container: HTMLElement, name = 'gifts.json') {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['{}'], name, {
    type: name.endsWith('.pdf') ? 'application/pdf' : 'application/json',
  });
  fireEvent.change(input, { target: { files: [file] } });
}

describe('ImportMenuPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    canShowAiRef.current = true;
  });

  test('expands to details with filename and title stem after picking a file', async () => {
    const { container, onSizeChange } = renderPanel();

    expect(screen.getByRole('dialog', { name: /^import$/i })).toBeInTheDocument();
    expect(onSizeChange).toHaveBeenCalledWith(288, 268);

    await selectFile(container);

    expect(screen.getByRole('dialog', { name: /import details/i })).toBeInTheDocument();
    expect(screen.getByText('gifts.json')).toBeInTheDocument();
    expect(screen.getByLabelText(/wishlist title/i)).toHaveValue('gifts');
    expect(onSizeChange).toHaveBeenCalledWith(320, 400);

    const createButton = screen.getByRole('button', { name: /create wishlist/i });
    expect(createButton).toBeDisabled();

    await waitFor(() => {
      expect(createButton).toBeEnabled();
    });
  });

  test('back returns to the dropzone and resets size', async () => {
    const { container, onSizeChange } = renderPanel();
    await selectFile(container);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /import details/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /^back$/i }));

    expect(screen.getByRole('dialog', { name: /^import$/i })).toBeInTheDocument();
    expect(screen.getByText(/choose a file/i)).toBeInTheDocument();
    expect(onSizeChange).toHaveBeenLastCalledWith(288, 268);
  });

  test('confirms create-list import once the file is ready', async () => {
    vi.mocked(jobsApi.startWishlistImport).mockResolvedValue({
      Id: 'job-1',
      Kind: 'wishlist-import',
      ListId: 'list-1',
      UserId: 'user-1',
      Status: 'completed',
      Phase: 'completed',
      ProgressDone: 1,
      ProgressTotal: 1,
      Message: 'Done',
      Error: null,
      GrabInfo: true,
      Mode: 'create-list',
    });

    const { container, onImported } = renderPanel();
    await selectFile(container);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create wishlist/i })).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /create wishlist/i }));

    await waitFor(() => {
      expect(onImported).toHaveBeenCalledWith({
        listId: 'list-1',
        jobId: 'job-1',
        created: 0,
        failed: 0,
      });
    });
  });

  test('existing-list mode omits the title field and uses Import items', async () => {
    const { container, onSizeChange } = renderPanel({
      mode: 'existing-list',
      listId: 'list-9',
    });

    await selectFile(container);

    expect(screen.queryByLabelText(/wishlist title/i)).toBeNull();
    expect(screen.getByRole('button', { name: /import items/i })).toBeDisabled();
    expect(onSizeChange).toHaveBeenCalledWith(320, 340);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /import items/i })).toBeEnabled();
    });
  });

  test('disables Optimize categories when Grab info is off', async () => {
    const { container } = renderPanel();
    await selectFile(container);

    await waitFor(() => {
      expect(screen.getByRole('group', { name: /ai features/i })).toBeInTheDocument();
    });

    const grabSwitch = screen.getByRole('checkbox', { name: /grab info/i });
    const optimizeSwitch = screen.getByRole('checkbox', { name: /optimize categories/i });
    expect(grabSwitch).toBeChecked();
    expect(optimizeSwitch).toBeEnabled();

    fireEvent.click(grabSwitch);
    expect(grabSwitch).not.toBeChecked();
    expect(optimizeSwitch).toBeDisabled();
  });
});
