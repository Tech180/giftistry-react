import type { MouseEvent } from 'react';

export interface RegistrationTemplateProps {
  registrationMode: 'open' | 'invite_only' | 'disabled';
  onSelect: (mode: 'open' | 'invite_only' | 'disabled') => void;
  onGlowMove: (event: MouseEvent<HTMLElement>) => void;
}
