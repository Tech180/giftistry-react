export interface Props {
  showExpanded: boolean;
  showExpandedMetadata: boolean;
  hasFundingContent: boolean;
  primaryImageUrl: string | null;
  displayDescription: string | null;
  predefinedDisplayEntries: { label: string; value: string }[];
  userDefinedEntries: { name: string; value: string }[];
  metadataBadgeEmoji: Record<string, string>;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
}
