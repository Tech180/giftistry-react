import {
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
  type ElementType,
} from 'react';

export type EnterAnimation =
  | 'dropdown'
  | 'accordion'
  | 'fade'
  | 'scale'
  | 'slide-down'
  | 'slide-up'
  | 'mini-left'
  | 'mini-right';

const ANIMATION_CLASS: Record<EnterAnimation, string> = {
  dropdown: 'animate-dropdown-in',
  accordion: 'animate-accordion-down',
  fade: 'animate-fade-in',
  scale: 'animate-scale-in',
  'slide-down': 'animate-slide-down',
  'slide-up': 'animate-slide-up',
  'mini-left': 'animate-mini-slide-from-left',
  'mini-right': 'animate-mini-slide-from-right',
};

export type EnterPanelProps = HTMLAttributes<HTMLDivElement> & {
  animation: EnterAnimation;
  children: ReactNode;
  as?: ElementType;
};

/**
 * Mount-only enter animation. React inserts nodes with the final class already
 * applied, which browsers often skip animating. This re-applies the class after
 * a reflow so the keyframe / @starting-style transition always runs.
 */
export const EnterPanel = forwardRef<HTMLDivElement, EnterPanelProps>(function EnterPanel(
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
    <Tag ref={ref as React.Ref<HTMLElement>} className={className} {...props}>
      {children}
    </Tag>
  );
});
