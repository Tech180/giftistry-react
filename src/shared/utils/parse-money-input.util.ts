import { MONEY_MAX_AMOUNT, MONEY_SCALE } from '../constants/money-limits.constant';
import { MONEY_AMOUNT_OUT_OF_RANGE_MESSAGE } from '../constants/money-messages.constant';
import type { ParseMoneyInputResult } from '../interfaces/parse-money-input-result.interface';

function hasTooManyDecimalPlaces(amount: number): boolean {
  const scaled = Math.round(amount * 10 ** MONEY_SCALE);
  return Math.abs(amount * 10 ** MONEY_SCALE - scaled) > 1e-9;
}

/** Parses a user-entered money string for API payloads. Empty input → null. */
export function parseMoneyInput(raw: string): ParseMoneyInputResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, value: null };
  }

  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, message: MONEY_AMOUNT_OUT_OF_RANGE_MESSAGE };
  }
  if (amount > MONEY_MAX_AMOUNT) {
    return { ok: false, message: MONEY_AMOUNT_OUT_OF_RANGE_MESSAGE };
  }
  if (hasTooManyDecimalPlaces(amount)) {
    return { ok: false, message: MONEY_AMOUNT_OUT_OF_RANGE_MESSAGE };
  }

  return { ok: true, value: amount };
}
