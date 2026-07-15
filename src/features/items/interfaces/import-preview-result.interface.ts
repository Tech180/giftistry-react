import type { ImportFileFormat } from './import-file-format.interface';
import type { ImportedItemPreview } from './imported-item-preview.interface';

export type ImportParseMode = 'deterministic' | 'ai';

export interface ImportPreviewResult {
  Items: ImportedItemPreview[];
  Warnings: string[];
  SourceFormat: ImportFileFormat;
  ParseMode: ImportParseMode;
  SuggestedWishlistTitle?: string;
}
