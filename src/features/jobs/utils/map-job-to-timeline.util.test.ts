import { describe, expect, test } from 'vitest';
import { mapJobToTimeline, buildSeedTimeline } from './map-job-to-timeline.util';
import type { BackgroundJobView } from '../interfaces/background-job.interface';

function job(partial: Partial<BackgroundJobView>): BackgroundJobView {
  return {
    Id: 'job-1',
    Kind: 'wishlist-import',
    ListId: 'list-1',
    UserId: 'user-1',
    Status: 'running',
    Phase: 'parsing',
    ProgressDone: 0,
    ProgressTotal: 0,
    Message: 'Finding items…',
    Error: null,
    GrabInfo: false,
    Mode: 'create-list',
    ...partial,
  };
}

describe('mapJobToTimeline', () => {
  test('seeds upload done and found active before a job exists', () => {
    const view = buildSeedTimeline('create-list', true);
    expect(view.steps.find((s) => s.id === 'upload')?.tone).toBe('done');
    expect(view.steps.find((s) => s.id === 'found')?.tone).toBe('active');
    expect(view.steps.some((s) => s.id === 'grabInfo')).toBe(true);
  });

  test('omits grab steps when GrabInfo is false', () => {
    const view = mapJobToTimeline(job({ Phase: 'adding_items', GrabInfo: false }), {
      mode: 'create-list',
    });
    expect(view.steps.some((s) => s.id === 'grabInfo')).toBe(false);
    expect(view.steps.find((s) => s.id === 'finalized')?.tone).toBe('active');
    expect(view.steps.find((s) => s.id === 'upload')?.tone).toBe('done');
    expect(view.steps.find((s) => s.id === 'found')?.tone).toBe('done');
  });

  test('maps grabbing_info with active streams', () => {
    const view = mapJobToTimeline(
      job({
        Phase: 'grabbing_info',
        GrabInfo: true,
        Message: 'Grabbing info 1/4…',
        ProgressDone: 1,
        ProgressTotal: 4,
        ItemsSummary: {
          Total: 4,
          Pending: 1,
          Running: 2,
          Done: 1,
          Failed: 0,
          Skipped: 0,
        },
        ActiveStreams: [
          { Id: 's1', ItemId: 'a', Label: 'Widget A', Status: 'running' },
          { Id: 's2', ItemId: 'b', Label: 'Widget B', Status: 'running' },
        ],
      }),
      { mode: 'create-list' }
    );

    expect(view.steps.find((s) => s.id === 'grabInfo')?.tone).toBe('active');
    expect(view.steps.find((s) => s.id === 'grabInfo')?.label).toBe('Grab info 1/4');
    expect(view.streams).toHaveLength(2);
    expect(view.streams[0].label).toBe('Widget A');
    expect(view.streamsCaption).toMatch(/Streams 2\//);
    expect(view.percent).toBe(25);
  });

  test('uses ItemsSummary for grab label when overall progress is cumulative', () => {
    const view = mapJobToTimeline(
      job({
        Phase: 'grabbing_info',
        GrabInfo: true,
        Message: 'Grabbing info 2/8…',
        ProgressDone: 12,
        ProgressTotal: 20,
        ItemsSummary: {
          Total: 10,
          Pending: 4,
          Running: 2,
          Done: 2,
          Failed: 0,
          Skipped: 2,
        },
      }),
      { mode: 'existing-list' }
    );

    expect(view.steps.find((s) => s.id === 'grabInfo')?.label).toBe('Grab info 2/8');
    expect(view.percent).toBe(60);
  });

  test('counts failed grabs as finished on the timeline label', () => {
    const view = mapJobToTimeline(
      job({
        Phase: 'grabbing_info',
        GrabInfo: true,
        Message: 'Grabbing info 34/121…',
        ProgressDone: 170,
        ProgressTotal: 242,
        ItemsSummary: {
          Total: 121,
          Pending: 80,
          Running: 7,
          Done: 18,
          Failed: 16,
          Skipped: 0,
        },
      }),
      { mode: 'existing-list' }
    );

    expect(view.steps.find((s) => s.id === 'grabInfo')?.label).toBe('Grab info 34/121');
  });

  test('keeps grabInfo active when suspended mid-grab', () => {
    const view = mapJobToTimeline(
      job({
        Status: 'suspended',
        Phase: 'suspended',
        GrabInfo: true,
        Message: 'Suspended',
        ProgressDone: 2,
        ProgressTotal: 5,
        ItemsSummary: {
          Total: 5,
          Pending: 2,
          Running: 1,
          Done: 2,
          Failed: 0,
          Skipped: 0,
        },
        ActiveStreams: [{ Id: 's1', ItemId: 'a', Label: 'Gadget', Status: 'running' }],
      }),
      { mode: 'create-list' }
    );

    expect(view.steps.find((s) => s.id === 'grabInfo')?.tone).toBe('active');
    expect(view.steps.find((s) => s.id === 'found')?.tone).toBe('done');
    expect(view.steps.find((s) => s.id === 'grabInfo')?.label).toMatch(/Grab info 2\/5/);
  });

  test('marks active step error on failure', () => {
    const view = mapJobToTimeline(
      job({
        Status: 'failed',
        Phase: 'failed',
        Message: 'No items found in this file.',
        Error: 'No items found in this file.',
      }),
      { mode: 'create-list' }
    );
    expect(view.steps.find((s) => s.id === 'found')?.tone).toBe('error');
  });

  test('marks all steps done on completed with grab', () => {
    const view = mapJobToTimeline(
      job({
        Status: 'completed',
        Phase: 'completed',
        GrabInfo: true,
        Message: 'Import finished',
        ProgressDone: 3,
        ProgressTotal: 3,
      }),
      { mode: 'create-list' }
    );
    expect(view.steps.every((s) => s.tone === 'done')).toBe(true);
    expect(view.percent).toBe(100);
  });
});
