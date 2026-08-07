export interface ExtractMetadataCustomFields {
  Predefined: Record<string, string>;
  UserDefined: Record<string, string>;
}

export interface ExtractMetadataDiagnostics {
  Source?: string;
  Confidence?: string | number;
  FieldsFound?: string[];
  Blocked?: boolean;
  ValidationReason?: string;
  AiPopulate?: 'succeeded' | 'failed' | 'skipped';
}

export interface ExtractMetadataResult {
  Title: string;
  Price: number | null;
  Description: string | null;
  Category: string | null;
  CategoryAlternatives: string[];
  ImageUrl: string | null;
  WebsiteName: string | null;
  CustomFields: ExtractMetadataCustomFields;
  Diagnostics?: ExtractMetadataDiagnostics;
}
