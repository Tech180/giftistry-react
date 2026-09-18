/**
 * Ensures static CSS module references in TSX match class names defined in the imported CSS file.
 * Resolves shallow BEM nesting (&__element, &--modifier) under a block root.
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

  const bemStack: string[] = [];
  const elementFrames: boolean[] = [];
  let inKeyframes = false;

  for (const rawLine of css.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue;

    if (line.startsWith('@keyframes')) {
      inKeyframes = true;
    }
    if (inKeyframes) {
      if (line.includes('}') && !line.includes('{')) inKeyframes = false;
      continue;
    }

    const selectorMatch = line.match(/^([^{]+)\{/);
    const openBraces = (line.match(/\{/g) ?? []).length;
    const closeBraces = (line.match(/\}/g) ?? []).length;

    if (selectorMatch && !line.startsWith('@')) {
      const selectors = selectorMatch[1].split(',').map((s) => s.trim());
      const firstSel = selectors[0];
      const elementSel = firstSel.match(/^&(__[\w-]+)/);

      for (const sel of selectors) {
        if (bemStack.length === 0) {
          const root = sel.match(/^\.([a-zA-Z_][\w-]*)$/);
          if (root) {
            bemStack.push(root[1]);
            classes.add(root[1]);
          }
        }

        const element = sel.match(/^&(__[\w-]+)/);
        if (element && bemStack.length > 0) {
          classes.add(bemStack[0] + element[1]);
        }

        const modifier = sel.match(/^&(--[\w-]+)/);
        if (modifier && bemStack.length > 0) {
          classes.add(bemStack[bemStack.length - 1] + modifier[1]);
        }
      }

      if (openBraces > 0) {
        if (elementSel && bemStack.length > 0) {
          bemStack.push(bemStack[0] + elementSel[1]);
          elementFrames.push(true);
        } else {
          elementFrames.push(false);
        }
      }
    } else if (openBraces > 0) {
      elementFrames.push(false);
    }

    for (let i = 0; i < closeBraces; i++) {
      const wasElement = elementFrames.pop();
      if (wasElement && bemStack.length > 1) {
        bemStack.pop();
      }
    }
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
