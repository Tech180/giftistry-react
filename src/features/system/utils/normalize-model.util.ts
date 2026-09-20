import type { ModelApiRow } from '../interfaces/model-api-row.interface';
import type { ModelOption } from '../interfaces/model-option.interface';

export function normalizeModel(row: ModelApiRow): ModelOption | null {
  const id = (row.Id ?? '').trim();
  if (!id) {
    return null;
  }

  return {
    id,
    name: (row.Name ?? id).trim() || id,
    company: (row.Company ?? 'Other').trim() || 'Other',
    displayName: (row.DisplayName ?? id).trim() || id,
  };
}
