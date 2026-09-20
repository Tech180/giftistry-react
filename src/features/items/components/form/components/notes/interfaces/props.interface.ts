export interface Props {
  description: string;
  setDescription: (val: string) => void;
  canSummarizeNotes: boolean;
  isSummarizingNotes: boolean;
  canUndoSummarize: boolean;
  onSummarizeNotes: () => void;
  onUndoSummarize: () => void;
  isAutopopulating: boolean;
  isLoading: boolean;
  readOnly?: boolean;
  hasReadOnlyMetadata: boolean;
  readOnlyMetadataPredefined: { label: string; value: string }[];
  readOnlyMetadataUserDefined: { name: string; value: string }[];
  metadataBadgeEmoji: Record<string, string>;
}
