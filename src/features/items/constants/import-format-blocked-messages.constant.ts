export const IMPORT_FORMAT_UNSUPPORTED_MESSAGE = 'This is not a valid export, please upload a JSON, CSV, XLSX, TXT, or Markdown matching the existing export format.';

export const PDF_IMPORT_UNSUPPORTED_MESSAGE = 'PDF import is currently not supported, please import a CSV, XLSX, TXT, JSON, or Markdown file instead.';

export const IMPORT_FORMAT_BLOCKED_MESSAGES = [
  IMPORT_FORMAT_UNSUPPORTED_MESSAGE,
  PDF_IMPORT_UNSUPPORTED_MESSAGE,
] as const;
