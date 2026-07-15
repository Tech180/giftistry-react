import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CollapsibleStrip } from './collapsible-strip.component';

describe('CollapsibleStrip', () => {
  test('renders inline content only when expanded', () => {
    const { rerender } = render(
      <CollapsibleStrip title="Import" isExpanded={false}>
        <div>Drop files here</div>
      </CollapsibleStrip>
    );
    expect(screen.queryByText('Drop files here')).not.toBeInTheDocument();

    rerender(
      <CollapsibleStrip title="Import" isExpanded>
        <div>Drop files here</div>
      </CollapsibleStrip>
    );
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  test('renders status message when open', () => {
    render(
      <CollapsibleStrip
        title="Import"
        isExpanded
        status={{ tone: 'success', message: 'Created wishlist with 3 items' }}
      >
        <div>body</div>
      </CollapsibleStrip>
    );

    expect(screen.getByText('Created wishlist with 3 items')).toBeInTheDocument();
  });
});
