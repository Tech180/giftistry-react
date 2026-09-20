export type UsernameValidationResult =
  | { ok: true; value: string }
  | { ok: false; message: string };
