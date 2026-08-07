import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { Timeline } from './timeline.component';

describe('Timeline', () => {
  test('renders stream panel full-width under the step track for Grab info', () => {
    render(
      <Timeline
        steps={[
          { id: 'upload', label: 'Upload', tone: 'done' },
          { id: 'found', label: 'Found items', tone: 'done' },
          { id: 'created', label: 'Created wishlist', tone: 'done' },
          { id: 'finalized', label: 'Finalized item selection', tone: 'done' },
          { id: 'grabInfo', label: 'Grab info', metric: '1/4', tone: 'active' },
          { id: 'savedDetails', label: 'Saved details', tone: 'pending' },
        ]}
        streams={[
          { id: '1', label: 'Alpha', tone: 'active' },
          { id: '2', label: 'Beta', tone: 'active' },
        ]}
        streamsCaption="Streams 2/3"
      />
    );

    const main = screen.getByRole('list', { name: /import steps/i });
    expect(main).toHaveTextContent('Grab info');
    expect(main).toHaveTextContent('1/4');

    const streamsList = screen.getByRole('list', { name: /active grab streams/i });
    expect(streamsList).toHaveTextContent('Alpha');
    expect(streamsList).toHaveTextContent('Beta');
    expect(screen.getByText('2/3')).toBeInTheDocument();

    // Panel lives under the track, not squeezed into a step column.
    expect(
      main.compareDocumentPosition(streamsList) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  test('shows stream phase detail and tok/s beside the label', () => {
    render(
      <Timeline
        steps={[
          { id: 'upload', label: 'Upload', tone: 'done' },
          { id: 'found', label: 'Found items', tone: 'done' },
          { id: 'created', label: 'Created wishlist', tone: 'done' },
          { id: 'finalized', label: 'Finalized item selection', tone: 'done' },
          { id: 'grabInfo', label: 'Grab info', tone: 'active' },
          { id: 'savedDetails', label: 'Saved details', tone: 'pending' },
        ]}
        streams={[
          {
            id: '1',
            label: 'Helix',
            tone: 'active',
            detail: 'Categorizing… · 32 tok/s',
            caption: 'Helix · Categorizing… · 32 tok/s',
          },
        ]}
        streamsCaption="Streams 1/1"
      />
    );

    const nested = screen.getByRole('list', { name: /active grab streams/i });
    expect(nested).toHaveTextContent('Helix');
    expect(nested).toHaveTextContent('Categorizing… · 32 tok/s');
    expect(within(nested).getByTitle('Helix · Categorizing… · 32 tok/s')).toBeInTheDocument();
  });

  test('renders more than three stream lanes without omitting labels', () => {
    render(
      <Timeline
        steps={[
          { id: 'upload', label: 'Upload', tone: 'done' },
          { id: 'found', label: 'Found items', tone: 'done' },
          { id: 'created', label: 'Created wishlist', tone: 'done' },
          { id: 'finalized', label: 'Finalized item selection', tone: 'done' },
          { id: 'grabInfo', label: 'Grab info', tone: 'active' },
          { id: 'savedDetails', label: 'Saved details', tone: 'pending' },
        ]}
        streams={[
          { id: '1', label: 'One', tone: 'active' },
          { id: '2', label: 'Two', tone: 'pending' },
          { id: '3', label: 'Three', tone: 'pending' },
          { id: '4', label: 'Four', tone: 'pending' },
          { id: '5', label: 'Five', tone: 'pending' },
        ]}
        streamsCaption="Streams 5/5"
      />
    );

    const nested = screen.getByRole('list', { name: /active grab streams/i });
    expect(nested).toHaveTextContent('One');
    expect(nested).toHaveTextContent('Two');
    expect(nested).toHaveTextContent('Three');
    expect(nested).toHaveTextContent('Four');
    expect(nested).toHaveTextContent('Five');
    expect(within(nested).getAllByRole('listitem')).toHaveLength(5);
  });

  test('does not render stream panel when streams are empty', () => {
    render(
      <Timeline
        steps={[
          { id: 'grabInfo', label: 'Grab info', tone: 'active' },
          { id: 'savedDetails', label: 'Saved details', tone: 'pending' },
        ]}
        streams={[]}
        streamsCaption="Streams 0/0"
      />
    );

    expect(screen.queryByRole('list', { name: /active grab streams/i })).toBeNull();
  });
});
