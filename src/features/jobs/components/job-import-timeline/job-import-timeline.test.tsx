import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { JobImportTimeline } from './job-import-timeline.html';

describe('JobImportTimeline', () => {
  test('nests stream lanes under the Grab info step', () => {
    render(
      <JobImportTimeline
        steps={[
          { id: 'upload', label: 'Upload', tone: 'done' },
          { id: 'found', label: 'Found items', tone: 'done' },
          { id: 'created', label: 'Created wishlist', tone: 'done' },
          { id: 'finalized', label: 'Finalized item selection', tone: 'done' },
          { id: 'grabInfo', label: 'Grab info', tone: 'active' },
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

    const grabStep = within(main)
      .getAllByRole('listitem')
      .find((item) => item.textContent?.includes('Grab info'));
    expect(grabStep).toBeTruthy();

    const nested = within(grabStep!).getByRole('list', { name: /active grab streams/i });
    expect(nested).toHaveTextContent('Alpha');
    expect(nested).toHaveTextContent('Beta');
    expect(within(grabStep!).getByText('Streams 2/3')).toBeInTheDocument();

    // Streams are nested under Grab info, not a sibling of the main timeline.
    expect(main.compareDocumentPosition(nested) & Node.DOCUMENT_POSITION_CONTAINED_BY).toBeTruthy();
  });
});
