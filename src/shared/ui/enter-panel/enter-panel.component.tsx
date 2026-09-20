import {
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { ANIMATION_CLASS } from './constants/animation-class.constant';
import type { Props } from './interfaces/props.interface';
import { EnterPanelTemplate } from './enter-panel.html';

/**
 * Mount-only enter animation. React inserts nodes with the final class already
 * applied, which browsers often skip animating. This re-applies the class after
 * a reflow so the keyframe / @starting-style transition always runs.
 */
export const EnterPanel = forwardRef<HTMLDivElement, Props>(function EnterPanel(
  { animation, className = '', children, as: Tag = 'div', ...props },
  forwardedRef
) {
  const ref = useRef<HTMLDivElement>(null);
  const animClass = ANIMATION_CLASS[animation];

  useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.remove(animClass);
    void el.getBoundingClientRect();
    el.classList.add(animClass);
  }, [animClass]);

  return (
    <EnterPanelTemplate
      Tag = {
        Tag
      }
      className = {
        className
      }
      elementRef = {
        ref
      }
      {...props}
    >
      {children}
    </EnterPanelTemplate>
  );
});
