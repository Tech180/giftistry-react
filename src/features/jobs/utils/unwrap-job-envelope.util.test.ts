import { describe, expect, test } from 'vitest';
import { unwrapJobEnvelope } from './unwrap-job-envelope.util';

describe('unwrapJobEnvelope', () => {
  test('returns { Job } payloads as-is', () => {
    const payload = { Job: { Id: 'job-1' }, Item: { Id: 'item-1' } };
    expect(unwrapJobEnvelope(payload)).toEqual(payload);
  });

  test('unwraps a nested PascalCase Data envelope', () => {
    const inner = { Job: { Id: 'job-1' } };
    expect(unwrapJobEnvelope({ Data: inner })).toEqual(inner);
  });

  test('returns empty object for non-objects', () => {
    expect(unwrapJobEnvelope(null)).toEqual({});
    expect(unwrapJobEnvelope(undefined)).toEqual({});
    expect(unwrapJobEnvelope('x')).toEqual({});
  });

  test('does not peel camelCase data wrappers', () => {
    const nested = { data: { Job: { Id: 'job-1' } } };
    expect(unwrapJobEnvelope(nested)).toEqual(nested);
  });
});
