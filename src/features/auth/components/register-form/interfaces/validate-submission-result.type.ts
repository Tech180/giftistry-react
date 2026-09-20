export type ValidateSubmissionResult =
  | { ok: true; username: string }
  | { ok: false; message: string };
