import type React from 'react';
import type { ExtractMetadataResult } from '../../../interfaces/extract-metadata-result.interface';

export interface UseEnrichResult {
  isAutopopulating: boolean;
  setIsAutopopulating: React.Dispatch<React.SetStateAction<boolean>>;
  isScrapeButtonPulsing: boolean;
  handleScrapeClick: (e: React.MouseEvent) => Promise<void>;
  applyExtractedMetadata: (data: ExtractMetadataResult) => void;
}
