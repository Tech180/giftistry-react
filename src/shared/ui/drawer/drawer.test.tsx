import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Drawer } from './drawer.component';

const SHEET_MOBILE_QUERY = '(max-width: 48rem)';

describe('Drawer', () => {
  let sheetMobileMatches = true;
  let sheetMobileListeners: Array<(event: MediaQueryListEvent) => void> = [];

  beforeEach(() => {
    sheetMobileMatches = true;
    sheetMobileListeners = [];

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        get matches() {
          return query === SHEET_MOBILE_QUERY ? sheetMobileMatches : false;
        },
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          if (query === SHEET_MOBILE_QUERY) {
            sheetMobileListeners.push(listener);
          }
        },
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          sheetMobileListeners = sheetMobileListeners.filter((item) => item !== listener);
        },
        dispatchEvent: () => false,
      }))
    );
  });

  afterEach(() => {
    document.body.style.overflow = '';
    document.body.removeAttribute('data-drawer-sheet-open');
    vi.unstubAllGlobals();
  });

  test('default rail does not render a scrim', () => {
    render(
      <Drawer isOpen title="Rail" position="right" onClose={vi.fn()}>
        <p>Content</p>
      </Drawer>
    );

    expect(screen.queryByTestId('drawer-scrim')).toBeNull();
    expect(screen.getByTestId('drawer-panel').className).not.toMatch(/sheet/);
  });

  test('sheet presentation shows scrim on mobile when open and applies sheet class', () => {
    sheetMobileMatches = true;

    render(
      <Drawer
        isOpen
        title="Comments"
        position="right"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    expect(screen.getByTestId('drawer-scrim')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-scrim').className).toMatch(/overlay-active/);
    expect(screen.getByTestId('drawer-panel').className).toMatch(/sheet/);
  });

  test('sheet presentation does not show scrim on desktop', () => {
    sheetMobileMatches = false;

    render(
      <Drawer
        isOpen
        title="Comments"
        position="right"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    expect(screen.queryByTestId('drawer-scrim')).toBeNull();
    expect(screen.getByTestId('drawer-panel').className).toMatch(/sheet/);
  });

  test('sheet presentation locks body scroll on mobile and sets open attribute', () => {
    sheetMobileMatches = true;

    const { unmount } = render(
      <Drawer
        isOpen
        title="Add Item"
        position="left"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Form</p>
      </Drawer>
    );

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.getAttribute('data-drawer-sheet-open')).toBe('true');

    unmount();

    expect(document.body.getAttribute('data-drawer-sheet-open')).toBeNull();
  });

  test('sheet presentation does not lock body scroll on desktop', () => {
    sheetMobileMatches = false;

    render(
      <Drawer
        isOpen
        title="Add Item"
        position="left"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Form</p>
      </Drawer>
    );

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.body.getAttribute('data-drawer-sheet-open')).toBeNull();
  });

  test('sheet scrim click calls onClose', () => {
    sheetMobileMatches = true;
    const onClose = vi.fn();
    render(
      <Drawer
        isOpen
        title="Comments"
        position="right"
        onClose={onClose}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    fireEvent.click(screen.getByTestId('drawer-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('closed sheet does not lock body or activate scrim', () => {
    sheetMobileMatches = true;

    render(
      <Drawer
        isOpen={false}
        title="Comments"
        position="right"
        onClose={vi.fn()}
        mobilePresentation="sheet"
      >
        <p>Chat</p>
      </Drawer>
    );

    expect(document.body.style.overflow).not.toBe('hidden');
    expect(document.body.getAttribute('data-drawer-sheet-open')).toBeNull();
    expect(screen.getByTestId('drawer-scrim').className).not.toMatch(/overlay-active/);
  });

  test('overlay variant shows scrim on desktop', () => {
    sheetMobileMatches = false;

    render(
      <Drawer isOpen title="Overlay" position="right" onClose={vi.fn()} variant="overlay">
        <p>Overlay content</p>
      </Drawer>
    );

    expect(screen.getByTestId('drawer-scrim')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-scrim').className).toMatch(/overlay-active/);
  });

  function MiniProbe({ inlineOnMobile }: { inlineOnMobile?: boolean }) {
    return <div data-testid="mini-probe" data-inline={String(!!inlineOnMobile)} />;
  }

  test('sheet + desktop floats mini outside sheet content without inlineOnMobile', () => {
    sheetMobileMatches = false;

    render(
      <Drawer
        isOpen
        title="Add Item"
        position="left"
        onClose={vi.fn()}
        mobilePresentation="sheet"
        overflowVisible
        miniDrawer={<MiniProbe />}
      >
        <p>Form</p>
      </Drawer>
    );

    const probe = screen.getByTestId('mini-probe');
    expect(probe).toHaveAttribute('data-inline', 'false');
    expect(screen.queryByTestId('drawer-sheet-content')).toBeNull();
    expect(probe.parentElement).toBe(screen.getByTestId('drawer-panel'));
  });

  test('sheet + mobile integrates mini inline inside sheet content', () => {
    sheetMobileMatches = true;

    render(
      <Drawer
        isOpen
        title="Add Item"
        position="left"
        onClose={vi.fn()}
        mobilePresentation="sheet"
        overflowVisible
        miniDrawer={<MiniProbe />}
      >
        <p>Form</p>
      </Drawer>
    );

    const probe = screen.getByTestId('mini-probe');
    expect(probe).toHaveAttribute('data-inline', 'true');
    expect(screen.getByTestId('drawer-sheet-content')).toContainElement(probe);
  });
});
