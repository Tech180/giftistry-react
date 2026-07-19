export function toCamelCaseKey(key: string): string {
  if (!key) return key;
  return key.charAt(0).toLowerCase() + key.slice(1);
}

export function camelcaseKeys(value: any): any {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(camelcaseKeys);
  if (typeof value !== 'object') return value;

  const result: Record<string, any> = {};
  for (const [key, nested] of Object.entries(value)) {
    result[toCamelCaseKey(key)] = camelcaseKeys(nested);
  }
  return result;
}
