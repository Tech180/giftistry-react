import { MONEY_MAX_INTEGER_DIGITS, MONEY_SCALE } from '../constants/money-limits.constant';

/** Matches partial money typing: up to 8 integer digits and optional cents. */
export const MONEY_INPUT_PATTERN = new RegExp(
  `^\\d{0,${MONEY_MAX_INTEGER_DIGITS}}(\\.\\d{0,${MONEY_SCALE}})?$`
);

export function isPartialMoneyInput(value: string): boolean {
  return MONEY_INPUT_PATTERN.test(value);
}
