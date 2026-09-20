import type { ImportFileFormat } from './import-file-format.interface';
import type { ImportContentEncoding } from './import-content-encoding.type';

export interface ReadImportFileResult {
  fileName: string;
  format: ImportFileFormat;
  content: string;
  contentEncoding: ImportContentEncoding;
}
