import { describe, expect, test } from 'vitest';
import type { Friend } from 'features/friends';
import { enrichWithBirthday } from './enrich-with-birthday.util';
import { filterByQuery } from './filter-by-query.util';
import { getDaysUntilBirthday } from './get-days-until-birthday.util';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { isTabId } from './is-tab-id.util';
import { parseTab } from './parse-tab.util';
import { sortByMethod } from './sort.util';

const makeFriend = (overrides: Partial<Friend> & Pick<Friend, 'Id' | 'UserId' | 'Username'>): Friend => ({
  FirstName: '',
  LastName: '',
  Email: '',
  Avatar: null,
  ...overrides,
});

describe('friends utils', () => {
  test('isTabId narrows known ids', () => {
    expect(isTabId('current')).toBe(true);
    expect(isTabId('requests')).toBe(true);
    expect(isTabId('search')).toBe(true);
    expect(isTabId('other')).toBe(false);
  });

  test('parseTab returns null for invalid values', () => {
    expect(parseTab('current')).toBe('current');
    expect(parseTab('requests')).toBe('requests');
    expect(parseTab(null)).toBe(null);
    expect(parseTab('bogus')).toBe(null);
  });

  test('getDaysUntilBirthday returns 999 when missing', () => {
    expect(getDaysUntilBirthday(null)).toBe(999);
    expect(getDaysUntilBirthday(undefined)).toBe(999);
  });

  test('getDaysUntilBirthday returns 0 for today', () => {
    const today = new Date();
    const iso = today.toISOString();
    expect(getDaysUntilBirthday(iso)).toBe(0);
  });

  test('getDisplayName prefers first name', () => {
    expect(
      getDisplayName(
        makeFriend({
          Id: '1',
          UserId: 'u1',
          Username: 'jdoe',
          FirstName: 'Jane',
          LastName: 'Doe',
        }),
      ),
    ).toBe('Jane Doe');
    expect(
      getDisplayName(
        makeFriend({
          Id: '2',
          UserId: 'u2',
          Username: 'jdoe',
          FirstName: '',
        }),
      ),
    ).toBe('jdoe');
  });

  test('filterByQuery matches name or username', () => {
    const friends = [
      makeFriend({ Id: '1', UserId: 'u1', Username: 'alice', FirstName: 'Alice', LastName: 'Smith' }),
      makeFriend({ Id: '2', UserId: 'u2', Username: 'bob', FirstName: 'Bob', LastName: 'Jones' }),
    ];
    expect(filterByQuery(friends, 'ali')).toHaveLength(1);
    expect(filterByQuery(friends, 'bob')).toHaveLength(1);
    expect(filterByQuery(friends, '')).toHaveLength(2);
  });

  test('sortByMethod by name and birthday', () => {
    const friends = [
      makeFriend({
        Id: '1',
        UserId: 'u1',
        Username: 'z',
        FirstName: 'Zoe',
        DaysUntilBirthday: 30,
      }),
      makeFriend({
        Id: '2',
        UserId: 'u2',
        Username: 'a',
        FirstName: 'Amy',
        DaysUntilBirthday: 5,
      }),
    ];
    expect(sortByMethod(friends, 'name').map((f) => f.FirstName)).toEqual(['Amy', 'Zoe']);
    expect(sortByMethod(friends, 'birthday').map((f) => f.FirstName)).toEqual(['Amy', 'Zoe']);
  });

  test('enrichWithBirthday sets DaysUntilBirthday', () => {
    const friends = [
      makeFriend({ Id: '1', UserId: 'u1', Username: 'a', Birthday: null }),
    ];
    expect(enrichWithBirthday(friends)[0].DaysUntilBirthday).toBe(999);
  });
});
