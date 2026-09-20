import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { DropdownMenu } from './dropdown-menu/dropdown-menu.component';

const readSrc = (relativePath: string) =>
  readFileSync(join(process.cwd(), 'src', relativePath), 'utf-8');

describe('Dropdown opening animations', () => {
  test('navigation dropdown panels use EnterPanel', () => {
    const search = readSrc(
      'app/layout/app-navigation/components/wishlist-search/wishlist-search.html.tsx'
    );
    const theme = readSrc(
      'app/layout/app-navigation/components/theme-menu/theme-menu.html.tsx'
    );
    const profile = readSrc(
      'app/layout/app-navigation/components/profile/menu/profile-menu.html.tsx'
    );

    expect(search.includes('EnterPanel')).toBe(true);
    expect(search.includes('search-dropdown')).toBe(true);
    expect(theme.includes('EnterPanel')).toBe(true);
    expect(profile.includes('EnterPanel')).toBe(true);
  });

  test('export dropdown panel uses EnterPanel', () => {
    const src = readSrc('app/pages/wishlist-detail/components/header/header.html.tsx');

    expect(src.includes('EnterPanel')).toBe(true);
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

    expect(css.includes('@keyframes dropdown-in')).toBe(true);
    expect(css.includes('animate-dropdown-in')).toBe(true);
    expect(css.includes('@starting-style')).toBe(true);
  });

  test('item claim panels use EnterPanel', () => {
    const compact = readSrc(
      'features/items/components/views/compact/components/claim-section/claim-section.html.tsx'
    );
    const feed = readSrc(
      'features/items/components/views/feed/components/claim-section/claim-section.html.tsx'
    );

    expect(compact.includes('EnterPanel')).toBe(true);
    expect(feed.includes('EnterPanel')).toBe(true);
  });

  test('global animation utilities define accordion-down keyframes', () => {
    const css = readSrc('assets/styles/global.css');

    expect(css.includes('@keyframes accordion-down')).toBe(true);
    expect(css.includes('animate-accordion-down')).toBe(true);
  });
});
