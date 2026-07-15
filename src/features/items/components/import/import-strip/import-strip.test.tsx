import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ImportStrip } from './import-strip.component';

vi.mock('features/jobs', async () => {
  const actual = await vi.importActual<typeof import('features/jobs')>('features/jobs');
  return {
    ...actual,
    jobsApi: {
      startWishlistImport: vi.fn(),
      getJob: vi.fn(),
    },
  };
});

vi.mock('features/items/utils/read-import-file.util', () => ({
  readImportFile: vi.fn(async (file: File, options?: { onProgress?: (n: number) => void }) => {
    options?.onProgress?.(40);
    options?.onProgress?.(100);
    return {
      fileName: file.name,
      format: 'json' as const,
      content: '{}',
      contentEncoding: 'text' as const,
    };
  }),
}));

vi.mock('app/providers/toast-context', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

import { jobsApi } from 'features/jobs';

function renderStrip(onImported = vi.fn()) {
  return render(
    <MemoryRouter>
      <ImportStrip mode="create-list" isExpanded onImported={onImported} />
    </MemoryRouter>
  );
}

async function selectFile(container: HTMLElement) {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['{}'], 'gifts.json', { type: 'application/json' });
  fireEvent.change(input, { target: { files: [file] } });
}

describe('ImportStrip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('uploads a file and waits for create without starting a job yet', async () => {
    const { container } = renderStrip();
    await selectFile(container);

    await waitFor(() => {
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });
    expect(jobsApi.startWishlistImport).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /create wishlist/i })).toBeEnabled();
  });

  test('seeds timeline and updates from job progress after create', async () => {
    vi.mocked(jobsApi.startWishlistImport).mockResolvedValue({
      Id: 'job-1',
      Kind: 'wishlist-import',
      ListId: null,
      UserId: 'user-1',
      Status: 'running',
      Phase: 'parsing',
      ProgressDone: 0,
      ProgressTotal: 100,
      Message: 'Finding items…',
      Error: null,
      GrabInfo: true,
      Mode: 'create-list',
    });
    vi.mocked(jobsApi.getJob).mockResolvedValue({
      Id: 'job-1',
      Kind: 'wishlist-import',
      ListId: 'list-9',
      UserId: 'user-1',
      Status: 'running',
      Phase: 'creating_list',
      ProgressDone: 10,
      ProgressTotal: 100,
      Message: 'Creating wishlist…',
      Error: null,
      GrabInfo: true,
      Mode: 'create-list',
    });

    const onImported = vi.fn();
    const { container } = renderStrip(onImported);
    await selectFile(container);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /grab info/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /grab info/i }));
    fireEvent.change(screen.getByLabelText(/wishlist title/i), {
      target: { value: 'Holiday' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create wishlist/i }));

    await waitFor(() => {
      expect(screen.getByRole('list', { name: /import steps/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('list', { name: /import steps/i })).toHaveTextContent('Upload');
    expect(screen.getByRole('list', { name: /import steps/i })).toHaveTextContent('Grab info');

    await waitFor(() => {
      expect(onImported).toHaveBeenCalledWith({
        listId: 'list-9',
        jobId: 'job-1',
        created: 0,
        failed: 0,
      });
    });
  });

  test('renders nothing when collapsed', () => {
    const { container } = render(
      <MemoryRouter>
        <ImportStrip mode="create-list" isExpanded={false} onImported={() => {}} />
      </MemoryRouter>
    );
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });
});
