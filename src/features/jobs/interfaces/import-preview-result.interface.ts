import type { ImportFileFormat } from 'features/items/interfaces/import-file-format.interface';

export interface ImportPreviewResult {
  Items: Array<{
    Name: string;
    Category?: string;
    Priority?: number;
    Description?: string;
    Price?: number | null;
    WebsiteLink?: string;
    IsFavorite?: boolean;
    DesiredQuantity?: number;
  }>;
  Warnings: string[];
  SourceFormat: ImportFileFormat | string;
  ParseMode: 'deterministic' | 'ai' | string;
  SuggestedWishlistTitle?: string;
}
