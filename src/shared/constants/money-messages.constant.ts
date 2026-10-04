import { MONEY_MAX_AMOUNT } from './money-limits.constant';

export const MONEY_AMOUNT_OUT_OF_RANGE_MESSAGE = `Amount must be between 0 and ${MONEY_MAX_AMOUNT.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
