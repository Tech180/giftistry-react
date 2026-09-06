import type {
  ExtractMetadataCustomFields,
  ExtractMetadataDiagnostics,
  ExtractMetadataResult,
} from '../interfaces/extract-metadata-result.interface';
import { AI_JOB_METADATA_WRAPPER_KEYS } from '../constants/ai-job-result.constants';

function toStringFieldMap(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'string' && value.trim()) {
      result[key] = value.trim();
    }
  }
  return result;
}

export function normalizeExtractCustomFields(raw: unknown): ExtractMetadataCustomFields {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { Predefined: {}, UserDefined: {} };
  }

  const source = raw as Record<string, unknown>;
  return {
    Predefined: toStringFieldMap(source.Predefined ?? {}),
    UserDefined: toStringFieldMap(source.UserDefined ?? {}),
  };
}

function toStringOrNull(raw: unknown): string | null {
  return typeof raw === 'string' && raw.trim() ? raw : null;
}

function toNumberOrNull(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && raw.trim()) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function resolveMetadataSource(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;

  const source = raw as Record<string, unknown>;
  if ('Title' in source || 'CustomFields' in source) return source;

  for (const key of AI_JOB_METADATA_WRAPPER_KEYS) {
    const nested = resolveMetadataSource(source[key]);
    if (nested) return nested;
  }

  return null;
}

/** Maps an `item-enrich` job Result onto the shape the add-item form applies. */
export function toExtractMetadataResult(raw: unknown): ExtractMetadataResult | null {
  const source = resolveMetadataSource(raw);
  if (!source) return null;

  const categoryAlternatives = Array.isArray(source.CategoryAlternatives)
    ? source.CategoryAlternatives.filter((value): value is string => typeof value === 'string')
    : [];

  return {
    Title: toStringOrNull(source.Title) ?? '',
    Price: toNumberOrNull(source.Price),
    Description: toStringOrNull(source.Description),
    Category: toStringOrNull(source.Category),
    CategoryAlternatives: categoryAlternatives,
    ImageUrl: toStringOrNull(source.ImageUrl),
    WebsiteName: toStringOrNull(source.WebsiteName),
    ResolvedUrl: toStringOrNull(source.ResolvedUrl),
    CustomFields: normalizeExtractCustomFields(source.CustomFields),
    Diagnostics: (source.Diagnostics as ExtractMetadataDiagnostics | undefined) ?? undefined,
  };
}

/** Reads the generated notes out of an `item-summarize` job Result. */
export function toSummarizedDescription(raw: unknown): string | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;
  return toStringOrNull(source.Description) ?? toStringOrNull(source.Text);
}
