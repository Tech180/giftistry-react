import type { HTMLAttributes, ReactNode, ElementType } from 'react';
import type { EnterAnimation } from './enter-animation.type';

export type Props = HTMLAttributes<HTMLDivElement> & {
  animation: EnterAnimation;
  children: ReactNode;
  as?: ElementType;
};

/** @deprecated Prefer `Props`; kept for barrel consumers. */
export type EnterPanelProps = Props;
