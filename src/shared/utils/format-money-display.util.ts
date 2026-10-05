import { MONEY_SCALE } from '../constants/money-limits.constant';

const usdFractionDigits = {
  minimumFractionDigits: MONEY_SCALE,
  maximumFractionDigits: MONEY_SCALE,
} as const;

/** Fixed two-decimal amount without currency symbol (e.g. 15 → "15.00"). */
export function formatMoneyAmount(amount: number): string {
  return amount.toLocaleString('en-US', usdFractionDigits);
}

/** USD with symbol (e.g. 15 → "$15.00"). */
export function formatUsd(amount: number): string {
  return `$${formatMoneyAmount(amount)}`;
}

export function formatUsdOrFallback(
  amount: number | null | undefined,
  fallback = '\u2014'
): string {
  if (amount == null || !Number.isFinite(amount)) {
    return fallback;
  }
  return formatUsd(amount);
}

/** Parse hydrate/API values for read-only display (empty/invalid → fallback). */
export function formatMoneyFromUnknown(
  raw: string | number | null | undefined,
  fallback = ''
): string {
  if (raw == null || raw === '') {
    return fallback;
  }
  const amount = typeof raw === 'number' ? raw : Number(String(raw).trim());
  if (!Number.isFinite(amount)) {
    return fallback;
  }
  return formatMoneyAmount(amount);
}
