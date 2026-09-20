export interface TemplateProps {
  showExpandedMetadata: boolean;
  hasFundingContent: boolean;
  primaryImageUrl: string | null;
  displayDescription: string | null;
  predefinedDisplayEntries: { label: string; value: string }[];
  userDefinedEntries: { name: string; value: string }[];
  metadataBadgeEmoji: Record<string, string>;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  rootClassName: string;
  contentClassName: string;
  photoColClassName: string;
  photoClassName: string;
  detailColClassName: string;
  descClassName: string;
  metadataClassName: string;
  asideClassName: string;
}
