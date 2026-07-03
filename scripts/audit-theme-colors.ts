/**
 * Scans CSS and template files for hardcoded theme colors.
 * Exit code 1 if violations found outside allowlist.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC = join(import.meta.dir, '../src');

const ALLOWLIST = [
  'features/comments/components/input/comment-input.module.css',
  'features/auth/components/image-cropper/image-cropper.module.css',
  'features/auth/components/profile-card/profile-card.component.tsx',
  'app/pages/profile/tabs/theming/theming-tab.html.tsx',
  'app/pages/profile/tabs/theming/theming-tab.component.tsx',
];

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;
const RGB_PATTERN = /\brgb\s*\(\s*\d+/g;
const HSL_PATTERN = /\bhsl\s*\(\s*\d+/g;

function walk(dir: string, ext: string[]): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walk(full, ext));
    } else if (ext.some((e) => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const files = [
  ...walk(SRC, ['.module.css']),
  ...walk(SRC, ['.html.tsx']),
];

let violations = 0;

for (const file of files) {
  const rel = relative(join(import.meta.dir, '..'), file);
  if (ALLOWLIST.some((a) => rel.endsWith(a))) continue;

  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, i) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) return;
    const matches = [
      ...(line.match(HEX_PATTERN) ?? []),
      ...(line.match(RGB_PATTERN) ?? []),
      ...(line.match(HSL_PATTERN) ?? []),
    ];
    if (matches.length > 0) {
      console.error(`${rel}:${i + 1}: ${matches.join(', ')}`);
      violations++;
    }
  });
}

if (violations > 0) {
  console.error(`\n${violations} theme color violation(s) found.`);
  process.exit(1);
} else {
  console.log('No theme color violations found.');
}
