import type { AudienceIconKind } from './audience-icon-kind.type';

export interface TemplateProps {
  audienceLabel: string | null;
  audienceIconKind: AudienceIconKind | null;
  isPrivate: boolean;
  sharedWithCount: number;
  showPriority: boolean;
  priority: number | null;
}
