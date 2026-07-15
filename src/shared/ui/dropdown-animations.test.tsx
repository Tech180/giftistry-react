import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DropdownMenu } from './dropdown-menu/dropdown-menu.component';

const readSrc = (relativePath: string) =>
  readFileSync(join(process.cwd(), 'src', relativePath), 'utf-8');

describe('Dropdown opening animations', () => {
  test('navigation dropdown panels use EnterPanel', () => {
    const src = readSrc('app/layout/app-navigation/app-navigation.html.tsx');

    expect(src).toMatch(/EnterPanel[\s\S]*search-dropdown/);
    expect(src).toMatch(/theme-menu.*EnterPanel|EnterPanel[\s\S]*theme-menu/);
    expect(src).toMatch(/dropdown-menu[\s\S]*EnterPanel|EnterPanel[\s\S]*dropdown-menu/);
  });

  test('export dropdown panel uses EnterPanel', () => {
    const src = readSrc('app/pages/wishlist-detail/components/header/header.html.tsx');

    expect(src).toMatch(/export-dropdown-menu[\s\S]*EnterPanel|EnterPanel[\s\S]*export-dropdown-menu/);
  });

  test('shared DropdownMenu wraps content in EnterPanel when open', async () => {
    const menuRef = React.createRef<HTMLDivElement>();
    const { container } = render(
      <DropdownMenu isOpen menuRef={menuRef}>
        <button type="button">Action</button>
      </DropdownMenu>
    );

    const panel = container.firstElementChild as HTMLElement;
    await waitFor(() => {
      expect(panel.classList.contains('animate-dropdown-in')).toBe(true);
    });
  });

  test('global animation utilities define dropdown keyframes and longhand properties', () => {
    const css = readSrc('assets/styles/global.css');

    expect(css).toMatch(/@keyframes dropdown-in/);
    expect(css).toMatch(/\.animate-dropdown-in[\s\S]*animation-fill-mode:\s*both/);
    expect(css).toMatch(/@starting-style/);
  });

  test('item view panels use EnterPanel', () => {
    const compact = readSrc('features/items/components/views/compact/compact-item-view.html.tsx');
    const grid = readSrc('features/items/components/views/grid/grid-item-view.html.tsx');

    expect(compact).toMatch(/confirm-extension[\s\S]*EnterPanel|EnterPanel[\s\S]*confirm-extension/);
    expect(grid).toMatch(/claim-overlay[\s\S]*EnterPanel|EnterPanel[\s\S]*claim-overlay/);
  });

  test('legacy item card module CSS is empty stub', () => {
    const css = readSrc('features/items/components/card/item-card.module.css');

    expect(css.trim().length).toBeLessThan(200);
  });

  test('global animation utilities define accordion-down keyframes', () => {
    const css = readSrc('assets/styles/global.css');

    expect(css).toMatch(/@keyframes accordion-down/);
    expect(css).toMatch(/\.animate-accordion-down[\s\S]*animation-fill-mode:\s*both/);
  });
});
