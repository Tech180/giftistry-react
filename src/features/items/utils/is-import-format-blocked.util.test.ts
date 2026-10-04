import { describe, expect, it } from 'vitest';
import {
  IMPORT_FORMAT_UNSUPPORTED_MESSAGE,
  PDF_IMPORT_UNSUPPORTED_MESSAGE,
} from '../constants/import-format-blocked-messages.constant';
import { isImportFormatBlocked } from './is-import-format-blocked.util';

describe('isImportFormatBlocked', () => {
  it('matches Giftistry format unsupported message', () => {
    expect(isImportFormatBlocked(IMPORT_FORMAT_UNSUPPORTED_MESSAGE)).toBe(true);
  });

  it('matches PDF unsupported message', () => {
    expect(isImportFormatBlocked(PDF_IMPORT_UNSUPPORTED_MESSAGE)).toBe(true);
  });

  it('does not match generic import failures', () => {
    expect(isImportFormatBlocked('No items found in this file.')).toBe(false);
    expect(isImportFormatBlocked('Import failed')).toBe(false);
    expect(isImportFormatBlocked(null)).toBe(false);
  });
});
