import type { AvatarEntry } from './avatar-entry.interface';
import type { Mode } from './mode.type';

export interface TemplateProps {
  mode: Mode;
  ariaLabel: string;
  visibleEntries: AvatarEntry[];
  overflowCount: number;
  guestOtherCount: number;
}
