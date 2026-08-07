import { describe, expect, test } from 'vitest';
import { normalizeJobsPayload } from './normalize-jobs-payload.util';

const sampleJob = {
  Id: 'job-1',
  Kind: 'wishlist-import',
  ListId: 'list-1',
  UserId: 'user-1',
  Status: 'running' as const,
  Phase: 'grabbing_info' as const,
  ProgressDone: 1,
  ProgressTotal: 2,
  Message: 'Working',
  Error: null,
};

describe('normalizeJobsPayload', () => {
  test('returns arrays as-is', () => {
    expect(normalizeJobsPayload([sampleJob])).toEqual([sampleJob]);
  });

  test('unwraps PascalCase wrapper keys', () => {
    expect(normalizeJobsPayload({ Data: [sampleJob] })).toEqual([sampleJob]);
    expect(normalizeJobsPayload({ Jobs: [sampleJob] })).toEqual([sampleJob]);
    expect(normalizeJobsPayload({ Result: [sampleJob] })).toEqual([sampleJob]);
    expect(normalizeJobsPayload({ Items: [sampleJob] })).toEqual([sampleJob]);
  });

  test('unwraps nested Result.Data shapes', () => {
    expect(normalizeJobsPayload({ Result: { Data: [sampleJob] } })).toEqual([sampleJob]);
  });

  test('returns empty for unexpected shapes', () => {
    expect(normalizeJobsPayload({ Ok: true })).toEqual([]);
    expect(normalizeJobsPayload(null)).toEqual([]);
  });

  test('does not unwrap camelCase wrappers', () => {
    expect(normalizeJobsPayload({ data: [sampleJob] })).toEqual([]);
    expect(normalizeJobsPayload({ jobs: [sampleJob] })).toEqual([]);
  });
});
