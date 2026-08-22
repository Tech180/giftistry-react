import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ImportStrip } from './import-strip.component';

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
import { readImportFile } from 'features/items/utils/read-import-file.util';

function renderStrip(onImported = vi.fn()) {
  return render(
    <MemoryRouter>
      <ImportStrip mode="create-list" isExpanded onImported={onImported} />
    </MemoryRouter>
  );
}

async function selectFile(container: HTMLElement, name = 'gifts.json') {
  const inputs = container.querySelectorAll('input[type="file"]');
  const input = inputs[inputs.length - 1] as HTMLInputElement;
  const file = new File(['{}'], name, {
    type: name.endsWith('.pdf') ? 'application/pdf' : 'application/json',
  });
  fireEvent.change(input, { target: { files: [file] } });
}

describe('ImportStrip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    canShowAiRef.current = true;
  });

  test('reaches Ready after local file read without starting import', async () => {
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
      expect(screen.getByRole('group', { name: /ai features/i })).toBeInTheDocument();
    });
    expect(screen.getByRole('checkbox', { name: /grab info/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /optimize categories/i })).not.toBeChecked();
    fireEvent.change(screen.getByLabelText(/wishlist title/i), {
      target: { value: 'Holiday' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create wishlist/i }));

    await waitFor(() => {
      expect(jobsApi.startWishlistImport).toHaveBeenCalledWith(
        expect.objectContaining({
          allowAi: true,
          grabInfo: true,
          optimizeCategories: false,
        })
      );
    });

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

  test('AI panel has Grab info and Optimize categories toggles', async () => {
    canShowAiRef.current = true;
    vi.mocked(jobsApi.startWishlistImport).mockResolvedValue({
      Id: 'job-opt',
      Kind: 'wishlist-import',
      ListId: 'list-opt',
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

    const { container } = renderStrip();
    await selectFile(container);

    await waitFor(() => {
      expect(screen.getByRole('group', { name: /ai features/i })).toBeInTheDocument();
    });

    const grabSwitch = screen.getByRole('checkbox', { name: /grab info/i });
    const optimizeSwitch = screen.getByRole('checkbox', { name: /optimize categories/i });
    expect(grabSwitch).toBeChecked();
    expect(optimizeSwitch).not.toBeChecked();
    expect(optimizeSwitch).toBeEnabled();

    fireEvent.click(optimizeSwitch);
    expect(optimizeSwitch).toBeChecked();

    fireEvent.click(grabSwitch);
    expect(grabSwitch).not.toBeChecked();
    expect(optimizeSwitch).toBeDisabled();

    fireEvent.click(grabSwitch);
    expect(optimizeSwitch).toBeEnabled();
    expect(optimizeSwitch).toBeChecked();

    fireEvent.click(optimizeSwitch);
    expect(optimizeSwitch).not.toBeChecked();

    fireEvent.change(screen.getByLabelText(/wishlist title/i), {
      target: { value: 'Holiday' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create wishlist/i }));

    await waitFor(() => {
      expect(jobsApi.startWishlistImport).toHaveBeenCalledWith(
        expect.objectContaining({
          grabInfo: true,
          optimizeCategories: false,
        })
      );
    });
  });

  test('hides Grab info and omits PDF from accept when AI is unavailable', async () => {
    canShowAiRef.current = false;
    const { container } = renderStrip();
    const inputs = container.querySelectorAll('input[type="file"]');
    expect(inputs.length).toBeGreaterThan(0);
    for (const input of Array.from(inputs)) {
      expect((input as HTMLInputElement).accept).toBe('.csv,.xlsx,.txt,.json');
      expect((input as HTMLInputElement).accept).not.toContain('pdf');
    }

    await selectFile(container);
    await waitFor(() => {
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });
    expect(screen.queryByRole('group', { name: /ai features/i })).toBeNull();
    expect(screen.queryByRole('checkbox', { name: /grab info/i })).toBeNull();
    expect(screen.queryByRole('checkbox', { name: /optimize categories/i })).toBeNull();
    expect(readImportFile).toHaveBeenCalledWith(
      expect.any(File),
      expect.objectContaining({ allowAi: false })
    );
  });

  test('rejects PDF via reader when AI is unavailable', async () => {
    canShowAiRef.current = false;
    const { container } = renderStrip();
    await selectFile(container, 'scan.pdf');

    await waitFor(() => {
      expect(
        screen.getAllByText(/Unsupported file type\. Use CSV, XLSX, TXT, or JSON\./i).length
      ).toBeGreaterThan(0);
    });
    expect(jobsApi.startWishlistImport).not.toHaveBeenCalled();
  });

  test('shows AI formats hint and sends AllowAi when AI is available', async () => {
    canShowAiRef.current = true;
    vi.mocked(jobsApi.startWishlistImport).mockResolvedValue({
      Id: 'job-2',
      Kind: 'wishlist-import',
      ListId: 'list-2',
      UserId: 'user-1',
      Status: 'completed',
      Phase: 'completed',
      ProgressDone: 1,
      ProgressTotal: 1,
      Message: 'Done',
      Error: null,
      GrabInfo: false,
      Mode: 'create-list',
    });

    const { container } = renderStrip();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toContain('.pdf');
    expect(screen.getByText(/CSV, XLSX, TXT, JSON, or PDF/i)).toBeInTheDocument();

    await selectFile(container);
    await waitFor(() => {
      expect(screen.getByText('Ready')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('checkbox', { name: /grab info/i }));
    fireEvent.change(screen.getByLabelText(/wishlist title/i), {
      target: { value: 'Holiday' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create wishlist/i }));

    await waitFor(() => {
      expect(jobsApi.startWishlistImport).toHaveBeenCalledWith(
        expect.objectContaining({
          allowAi: true,
          grabInfo: false,
        })
      );
    });
  });

  test('keeps a hidden file input when collapsed for menu browse', () => {
    const { container } = render(
      <MemoryRouter>
        <ImportStrip mode="create-list" isExpanded={false} onImported={() => {}} />
      </MemoryRouter>
    );
    expect(container.querySelector('input[type="file"]')).not.toBeNull();
    expect(screen.queryByText(/drop your wishlist export/i)).toBeNull();
  });

  test('browse() opens the menu file input filtered to an extension', async () => {
    const ref = React.createRef<import('./interfaces/import-strip-handle.interface').ImportStripHandle>();
    const { container } = render(
      <MemoryRouter>
        <ImportStrip ref={ref} mode="create-list" isExpanded={false} onImported={vi.fn()} />
      </MemoryRouter>
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => {});

    ref.current?.browse('csv');
    expect(input.accept).toBe('.csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);

    const file = new File(['a,b'], 'items.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(readImportFile).toHaveBeenCalledWith(
        expect.any(File),
        expect.objectContaining({ allowAi: true })
      );
    });
  });
});
