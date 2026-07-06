/**
 * Ensures static CSS module references in TSX match class names defined in the imported CSS file.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve, dirname } from 'path';

const ROOT = join(import.meta.dir, '..');
const SRC = join(ROOT, 'src');

const DYNAMIC_KEYS = new Set(['variant', 'size', 'type', 'padding', 'orientation']);

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

function extractCssClasses(css: string): Set<string> {
  const classes = new Set<string>();
  for (const match of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) {
    classes.add(match[1]);
  }
  return classes;
}

function extractStaticRefs(code: string): string[] {
  const refs: string[] = [];
  for (const match of code.matchAll(/styles\.([a-zA-Z_][\w]*)/g)) {
    if (!DYNAMIC_KEYS.has(match[1])) refs.push(match[1]);
  }
  for (const match of code.matchAll(/styles\['([^']+)'\]/g)) refs.push(match[1]);
  for (const match of code.matchAll(/styles\["([^"]+)"\]/g)) refs.push(match[1]);
  return refs;
}

let violations = 0;

for (const file of walk(SRC)) {
  const code = readFileSync(file, 'utf-8');
  const imports = [...code.matchAll(/import\s+styles\s+from\s+['"]([^'"]+\.module\.css)['"]/g)];
  if (!imports.length) continue;

  const refs = extractStaticRefs(code);
  for (const imp of imports) {
    const cssPath = resolve(dirname(file), imp[1]);
    const css = readFileSync(cssPath, 'utf-8');
    const classes = extractCssClasses(css);

    for (const ref of refs) {
      if (!classes.has(ref)) {
        violations++;
        console.error(
          `${relative(ROOT, file)}: styles.${ref} not found in ${relative(ROOT, cssPath)}`
        );
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} CSS module reference violation(s).`);
  process.exit(1);
}

console.log('CSS module reference audit passed.');
