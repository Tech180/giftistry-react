import type { ItemSubstitutionKind } from '../../../../../interfaces/item-substitution.interface';

export interface ViewerLink {
  id: string;
  href: string;
  label: string;
}

export interface TemplateProps {
  kind: ItemSubstitutionKind;
  createdByUserId: string;
  name: string;
  description: string | null;
  links: ViewerLink[];
}
