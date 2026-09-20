import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export function statusText(lane: TimelineStreamLane): string {
  if (lane.detail) {
    return lane.detail;
  }

  if (lane.tone === 'active') {
    return 'Running';
  }

  if (lane.tone === 'error') {
    return 'Failed';
  }

  if (lane.tone === 'done') {
    return 'Done';
  }

  return 'Pending';
}
