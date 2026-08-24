import { describe, expect, it } from 'vitest';
import {
  mapPreferencesFromApi,
  mapPreferencesToApi,
} from './notifications.api';

describe('notification preferences mapping', () => {
  it('defaults JobCompletions to true when API omits it', () => {
    expect(mapPreferencesFromApi({}).JobCompletions).toBe(true);
  });

  it('maps JobCompletions to and from the API field', () => {
    expect(mapPreferencesFromApi({ JobCompletions: false }).JobCompletions).toBe(false);
    expect(mapPreferencesToApi({ JobCompletions: false })).toEqual({
      JobCompletions: false,
    });
  });

  it('defaults PushAlerts to true when API omits it', () => {
    expect(mapPreferencesFromApi({}).PushAlerts).toBe(true);
  });

  it('maps PushAlerts to and from the API field', () => {
    expect(mapPreferencesFromApi({ PushAlerts: false }).PushAlerts).toBe(false);
    expect(mapPreferencesToApi({ PushAlerts: false })).toEqual({
      PushAlerts: false,
    });
  });
});
