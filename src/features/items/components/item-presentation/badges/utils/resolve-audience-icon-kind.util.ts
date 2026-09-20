import type { AudienceIconKind } from '../interfaces/audience-icon-kind.type';

export function resolveAudienceIconKind(label: string): AudienceIconKind {
  if (label === 'Everyone') {
    return 'everyone';
  }

  if (label === 'Only Me') {
    return 'only-me';
  }

  return 'default';
}
