import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  warningBadgeRevealed: boolean;
  onWarningBadgeReveal: (revealed: boolean) => void;
  isEditingCustomFieldName: (field: { id: string; name: string }) => boolean;
}
