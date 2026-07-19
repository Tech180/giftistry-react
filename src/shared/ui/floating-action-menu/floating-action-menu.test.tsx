import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { FloatingActionMenu } from './floating-action-menu.component';

describe('FloatingActionMenu', () => {
  let desktopQueryMatches = false;
  let desktopQueryListeners: Array<(event: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    desktopQueryMatches = false;
    desktopQueryListeners = [];

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        get matches() {
          return query === '(min-width: 48.0625rem)' ? desktopQueryMatches : false;
        },
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          if (query === '(min-width: 48.0625rem)') {
            desktopQueryListeners.push(listener);
          }
        },
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          desktopQueryListeners = desktopQueryListeners.filter((item) => item !== listener);
        },
        dispatchEvent: () => false,
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('opens and closes from the primary FAB', () => {
    render(
      <FloatingActionMenu
        actions={[
          {
            id: 'comments',
            label: 'Comments',
            icon: <span>C</span>,
            onClick: vi.fn(),
          },
        ]}
      />
    );

    expect(screen.queryByRole('menu', { name: /page actions/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    expect(screen.getByRole('menu', { name: /page actions/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close page actions/i }));
    expect(screen.queryByRole('menu', { name: /page actions/i })).toBeNull();
  });

  test('invokes action onClick and closes', () => {
    const onComments = vi.fn();
    render(
      <FloatingActionMenu
        actions={[
          {
            id: 'comments',
            label: 'Comments',
            icon: <span>C</span>,
            onClick: onComments,
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /comments/i }));
    expect(onComments).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu', { name: /page actions/i })).toBeNull();
  });

  test('expands export submenu children and invokes child onClick', () => {
    const onCsv = vi.fn();
    render(
      <FloatingActionMenu
        actions={[
          {
            id: 'export',
            label: 'Export',
            icon: <span>E</span>,
            children: [{ id: 'csv', label: 'CSV', onClick: onCsv }],
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^export$/i }));
    expect(screen.getByRole('menu', { name: /export options/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: /^csv$/i }));
    expect(onCsv).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu', { name: /page actions/i })).toBeNull();
  });

  test('closes on Escape', () => {
    render(
      <FloatingActionMenu
        actions={[
          {
            id: 'settings',
            label: 'Settings',
            icon: <span>S</span>,
            onClick: vi.fn(),
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    expect(screen.getByRole('menu', { name: /page actions/i })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('menu', { name: /page actions/i })).toBeNull();
  });

  test('grows toolbar height to fit five or more actions', () => {
    const { container } = render(
      <FloatingActionMenu
        actions={[
          { id: 'a1', label: 'One', icon: <span>1</span>, onClick: vi.fn() },
          { id: 'a2', label: 'Two', icon: <span>2</span>, onClick: vi.fn() },
          {
            id: 'a3',
            label: 'Three',
            icon: <span>3</span>,
            children: [{ id: 'child', label: 'Child', onClick: vi.fn() }],
          },
          { id: 'a4', label: 'Four', icon: <span>4</span>, onClick: vi.fn() },
          { id: 'a5', label: 'Five', icon: <span>5</span>, onClick: vi.fn() },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));

    const dock = container.querySelector('[class*="stateToolbar"]') as HTMLElement | null;
    expect(dock).not.toBeNull();
    expect(dock!.style.height).toBe('329px');
    expect(screen.getByRole('menuitem', { name: /five/i })).toBeInTheDocument();
  });

  test('sizes export panel to fit all children without scrolling', () => {
    const { container } = render(
      <FloatingActionMenu
        actions={[
          {
            id: 'export',
            label: 'Export',
            icon: <span>E</span>,
            children: [
              { id: 'csv', label: 'CSV', onClick: vi.fn() },
              { id: 'xlsx', label: 'XLSX', onClick: vi.fn() },
              { id: 'txt', label: 'TXT', onClick: vi.fn() },
              { id: 'json', label: 'JSON', onClick: vi.fn() },
              { id: 'pdf', label: 'PDF', onClick: vi.fn() },
            ],
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^export$/i }));

    const dock = container.querySelector('[class*="statePanel"]') as HTMLElement | null;
    expect(dock).not.toBeNull();
    // PAD 32 + HEADER 44 + 5×38 + 4×4 = 282
    expect(dock!.style.height).toBe('282px');
    expect(screen.getByRole('menuitem', { name: /^pdf$/i })).toBeInTheDocument();
  });

  test('renders custom panelContent for import-style actions', () => {
    const onFile = vi.fn();
    render(
      <FloatingActionMenu
        actions={[
          {
            id: 'import',
            label: 'Import',
            icon: <span>I</span>,
            panelWidth: 300,
            panelHeight: 320,
            panelContent: ({ closeMenu }) => (
              <button
                type="button"
                onClick={() => {
                  onFile();
                  closeMenu();
                }}
              >
                Dropzone stub
              </button>
            ),
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    fireEvent.click(screen.getByRole('menuitem', { name: /^import$/i }));
    expect(screen.getByRole('button', { name: /dropzone stub/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /dropzone stub/i }));
    expect(onFile).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /dropzone stub/i })).toBeNull();
  });

  test('closes when viewport becomes desktop width', () => {
    render(
      <FloatingActionMenu
        actions={[
          {
            id: 'comments',
            label: 'Comments',
            icon: <span>C</span>,
            onClick: vi.fn(),
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page actions/i }));
    expect(screen.getByRole('menu', { name: /page actions/i })).toBeInTheDocument();

    act(() => {
      desktopQueryMatches = true;
      desktopQueryListeners.forEach((listener) => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(screen.queryByRole('menu', { name: /page actions/i })).toBeNull();
  });
});
