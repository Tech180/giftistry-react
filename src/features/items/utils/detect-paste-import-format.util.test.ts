import { describe, expect, it } from 'vitest';
import {
  detectPasteImportFormat,
  pasteFileNameForFormat,
} from './detect-paste-import-format.util';

describe('detectPasteImportFormat', () => {
  it('detects JSON', () => {
    expect(detectPasteImportFormat('{"items":[]}')).toBe('json');
  });

  it('detects Giftistry TXT', () => {
    const txt = [
      '============================================================',
      'WISHLIST REGISTRY: HOLIDAY',
      '============================================================',
      '[HOME]',
    ].join('\n');
    expect(detectPasteImportFormat(txt)).toBe('txt');
  });

  it('detects Giftistry Markdown', () => {
    const md = ['# Socks', '', '- Category: Apparel', '- Favorite: no'].join('\n');
    expect(detectPasteImportFormat(md)).toBe('md');
  });

  it('returns unknown for prose', () => {
    expect(detectPasteImportFormat('just some notes')).toBe('unknown');
  });
});

describe('pasteFileNameForFormat', () => {
  it('maps formats to synthetic filenames', () => {
    expect(pasteFileNameForFormat('md')).toBe('paste.md');
    expect(pasteFileNameForFormat('json')).toBe('paste.json');
    expect(pasteFileNameForFormat('unknown')).toBe('paste.txt');
  });
});
