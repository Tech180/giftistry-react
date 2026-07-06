/**
 * Scans CSS module files for px spacing/typography, deep nesting, and descendant selectors.
 * Exit code 1 if violations found outside allowlist.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = join(import.meta.dir, '..');
const SRC = join(ROOT, 'src');

const ALLOWLIST = [
  'features/auth/components/image-cropper/image-cropper.module.css',
  'assets/styles/global.css',
];

const SPACING_TYPO_PROPS =
  /^\s*(padding|margin|gap|row-gap|column-gap|font-size|line-height|width|height|min-width|min-height|max-width|max-height|top|right|bottom|left|inset|transform|translate|grid-template-columns|grid-template-rows)\s*:/i;

const PX_PATTERN = /(-?\d+(?:\.\d+)?)px/g;

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

function isAllowedPx(px: string, line: string): boolean {
  if (px === '1px') return true;
  if (/\bborder(?:-top|-right|-bottom|-left)?\s*:/.test(line) && line.includes(`${px}px`)) return true;
  if (/\bbox-shadow\s*:/.test(line)) return true;
  if (/\bfilter\s*:/.test(line)) return true;
  if (/\bbackdrop-filter\s*:/.test(line)) return true;
  if (/\bstroke-width\s*:/.test(line)) return true;
  if (/\bclip-path\s*:/.test(line)) return true;
  if (/\btransform\s*:/.test(line)) return true;
  if (/\b@keyframes/.test(line)) return true;
  return false;
}

function checkFile(file: string): number {
  const rel = relative(ROOT, file);
  if (ALLOWLIST.some((a) => rel.endsWith(a))) return 0;

  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  let violations = 0;
  let braceDepth = 0;
  let mediaDepth = 0;
  let inKeyframes = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('//')) continue;

    if (trimmed.startsWith('@keyframes')) {
      inKeyframes = true;
      braceDepth += (line.match(/\{/g) ?? []).length;
      continue;
    }

    if (inKeyframes) {
      braceDepth += (line.match(/\{/g) ?? []).length;
      braceDepth -= (line.match(/\}/g) ?? []).length;
      if (braceDepth === 0) inKeyframes = false;
      continue;
    }

    if (trimmed.includes('@media')) {
      mediaDepth++;
    }

    const openBraces = (line.match(/\{/g) ?? []).length;
    const closeBraces = (line.match(/\}/g) ?? []).length;

    const selectorBeforeBrace = trimmed.match(/^([^{]+)\{/);
    if (selectorBeforeBrace && !trimmed.startsWith('@')) {
      const selector = selectorBeforeBrace[1].trim();

      const selectors = selector.split(',').map((s) => s.trim());
      for (const sel of selectors) {
        for (const classMatch of sel.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) {
          const className = classMatch[1];
          if (/[A-Z]/.test(className)) {
            console.error(
              `${rel}:${i + 1}: class "${className}" must be kebab-case (e.g. ${className.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()})`
            );
            violations++;
          }
        }

        if (/\.\S+\s+\.\S+/.test(sel)) {
          console.error(`${rel}:${i + 1}: descendant selector "${sel}"`);
          violations++;
        }

        if (/>\s*\./.test(sel) || /\.\S+>\w/.test(sel.replace(/\s+/g, ''))) {
          console.error(`${rel}:${i + 1}: child combinator selector "${sel}"`);
          violations++;
        }
      }

      const nestingDepth = braceDepth - mediaDepth;
      if (nestingDepth > 0) {
        console.error(`${rel}:${i + 1}: nested rule at depth ${nestingDepth + 1} "${selector}"`);
        violations++;
      }
    }

    if (SPACING_TYPO_PROPS.test(line)) {
      for (const match of line.matchAll(PX_PATTERN)) {
        const px = match[0];
        if (!isAllowedPx(px, line)) {
          console.error(`${rel}:${i + 1}: raw px in spacing/typography "${px}" → ${trimmed}`);
          violations++;
        }
      }
    }

    braceDepth += openBraces - closeBraces;
    if (trimmed === '}' && mediaDepth > 0 && braceDepth < mediaDepth) {
      mediaDepth = Math.max(0, mediaDepth - 1);
    }
  }

  return violations;
}

const files = [
  ...walk(SRC, ['.module.css']),
  join(SRC, 'assets/styles/global.css'),
];

let total = 0;
for (const file of files) {
  total += checkFile(file);
}

if (total > 0) {
  console.error(`\n${total} CSS convention violation(s) found.`);
  process.exit(1);
} else {
  console.log('No CSS convention violations found.');
}
