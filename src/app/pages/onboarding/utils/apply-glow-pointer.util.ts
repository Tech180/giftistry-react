import type { MouseEvent } from 'react';

export function applyGlowPointer(event: MouseEvent<HTMLElement>): void {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
  target.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
}
