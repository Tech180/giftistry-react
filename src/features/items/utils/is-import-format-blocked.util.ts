import { IMPORT_FORMAT_BLOCKED_MESSAGES } from '../constants/import-format-blocked-messages.constant';

export function isImportFormatBlocked(message: string | null | undefined): boolean {
  const trimmed = message?.trim() ?? '';
  if (!trimmed) {
    return false;
  }

  return IMPORT_FORMAT_BLOCKED_MESSAGES.some((blocked) => blocked === trimmed);
}
