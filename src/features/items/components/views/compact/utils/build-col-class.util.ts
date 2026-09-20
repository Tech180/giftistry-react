import type { ColClassResult } from '../interfaces/col-class-result.interface';

export function buildColClass(
  styles: Record<string, string>,
  baseClass: string,
  options: { filled?: boolean; dividerAfter?: boolean; dividerBefore?: boolean } = {}
): ColClassResult {
  const { filled = false, dividerAfter = false, dividerBefore = false } = options;
  return {
    className: [
      styles['view__col'],
      styles[baseClass],
      dividerAfter ? styles['view__col--divider-after'] : '',
      dividerBefore ? styles['view__col--divider-before'] : '',
    ]
      .filter(Boolean)
      .join(' '),
    measure: filled,
  };
}
