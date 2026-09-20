import { describe, expect, test } from 'vitest';
import { getDashboardGreeting } from './get-dashboard-greeting.util';
import { isDashboardTabId } from './is-dashboard-tab-id.util';
import { tabToBucket } from './tab-to-bucket.util';

describe('dashboard utils', () => {
  test('tabToBucket maps each tab', () => {
    expect(tabToBucket('my-lists')).toBe('my');
    expect(tabToBucket('shared')).toBe('shared');
    expect(tabToBucket('archive')).toBe('archive');
  });

  test('isDashboardTabId narrows known ids', () => {
    expect(isDashboardTabId('my-lists')).toBe(true);
    expect(isDashboardTabId('shared')).toBe(true);
    expect(isDashboardTabId('archive')).toBe(true);
    expect(isDashboardTabId('other')).toBe(false);
  });

  test('getDashboardGreeting uses time of day', () => {
    expect(getDashboardGreeting('Riley', 9)).toBe('Good morning, Riley');
    expect(getDashboardGreeting('Riley', 14)).toBe('Good afternoon, Riley');
    expect(getDashboardGreeting('Riley', 20)).toBe('Good evening, Riley');
  });
});
