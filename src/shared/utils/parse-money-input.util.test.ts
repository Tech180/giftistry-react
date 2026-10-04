import { describe, expect, test } from 'vitest';
import { MONEY_MAX_AMOUNT } from '../constants/money-limits.constant';
import { parseMoneyInput } from './parse-money-input.util';

describe('parse-money-input.util', () => {
  test('empty input is null', () => {
    expect(parseMoneyInput('')).toEqual({ ok: true, value: null });
    expect(parseMoneyInput('   ')).toEqual({ ok: true, value: null });
  });

  test('accepts max DECIMAL(10,2) value', () => {
    expect(parseMoneyInput(String(MONEY_MAX_AMOUNT))).toEqual({
      ok: true,
      value: MONEY_MAX_AMOUNT,
    });
  });

  test('rejects over max', () => {
    const result = parseMoneyInput('100000000');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/99,999,999.99/);
    }
  });

  test('rejects extra decimal precision', () => {
    expect(parseMoneyInput('1.999').ok).toBe(false);
  });
});
