import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetadataGrid } from './metadata-grid.html';

describe('MetadataGrid', () => {
  const emoji = { 'Shirt Size': '👕', Color: '🎨' };

  it('renders compact variant as inline chips', () => {
    render(
      <MetadataGrid
        variant="compact"
        metadataBadgeEmoji={emoji}
        priority={2}
        predefinedDisplayEntries={[
          { label: 'Shirt Size', value: 'Small' },
          { label: 'Color', value: 'Dress Blues' },
        ]}
        userDefinedEntries={[{ name: 'Notes', value: 'Gift wrap please' }]}
      />
    );

    expect(screen.queryByText('Details')).not.toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Shirt Size')).toBeInTheDocument();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Dress Blues')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Gift wrap please')).toBeInTheDocument();
  });

  it('renders badge variant with inline labels', () => {
    render(
      <MetadataGrid
        metadataBadgeEmoji={emoji}
        predefinedDisplayEntries={[{ label: 'Shirt Size', value: 'Medium' }]}
        userDefinedEntries={[]}
      />
    );

    expect(screen.getByText(/Shirt Size:/)).toBeInTheDocument();
    expect(screen.getByText(/Medium/)).toBeInTheDocument();
  });
});
