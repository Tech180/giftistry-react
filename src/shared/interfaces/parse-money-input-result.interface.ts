export type ParseMoneyInputResult =
  | { ok: true; value: number | null }
  | { ok: false; message: string };
