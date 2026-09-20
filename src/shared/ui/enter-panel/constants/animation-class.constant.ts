import type { EnterAnimation } from '../interfaces/enter-animation.type';

export const ANIMATION_CLASS: Record<EnterAnimation, string> = {
  dropdown: 'animate-dropdown-in',
  accordion: 'animate-accordion-down',
  fade: 'animate-fade-in',
  scale: 'animate-scale-in',
  'slide-down': 'animate-slide-down',
  'slide-up': 'animate-slide-up',
  'mini-left': 'animate-mini-slide-from-left',
  'mini-right': 'animate-mini-slide-from-right',
};
