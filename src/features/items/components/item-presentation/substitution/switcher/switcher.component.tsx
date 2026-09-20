import React, { useEffect, useRef, useState } from 'react';
import { SUBSTITUTION_SWITCH_LABEL } from '../../../../constants/substitution-messages.constant';
import { resolveDisplayVariantIndex } from '../../../../utils/resolve-display-variant.util';
import { resolveItemSubstitutionOptions } from '../../../../utils/resolve-item-substitution-options.util';
import type { Props } from './interfaces/props.interface';
import type { SlideDirection } from './interfaces/slide-direction.type';
import { SwitcherTemplate } from './switcher.html';
import styles from './switcher.module.css';

export const Switcher: React.FC<Props> = ({
  parent,
  options,
  userId,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  children,
  className,
}) => {
  const browse = resolveItemSubstitutionOptions(parent, options);
  const defaultIndex = resolveDisplayVariantIndex(parent, options, userId);
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [direction, setDirection] = useState<SlideDirection>('none');

  useEffect(() => {
    setInternalIndex(resolveDisplayVariantIndex(parent, options, userId));
  }, [parent.Id, parent.ActiveSubstitutionId, options, userId]);

  const activeIndex =
    typeof controlledIndex === 'number' ? controlledIndex : internalIndex;
  const clampedIndex = Math.min(Math.max(activeIndex, 0), Math.max(browse.length - 1, 0));

  const prevIndexRef = useRef(clampedIndex);
  useEffect(() => {
    if (clampedIndex > prevIndexRef.current) {
      setDirection('forward');
    } else if (clampedIndex < prevIndexRef.current) {
      setDirection('backward');
    }
    prevIndexRef.current = clampedIndex;
  }, [clampedIndex]);

  const setIndex = (index: number, slideDir?: SlideDirection) => {
    const next = Math.min(Math.max(index, 0), browse.length - 1);
    if (slideDir) {
      setDirection(slideDir);
    }
    if (onActiveIndexChange) {
      onActiveIndexChange(next);
    } else {
      setInternalIndex(next);
    }
  };

  const active = browse[clampedIndex] ?? browse[0]!;
  const canPrev = clampedIndex > 0;
  const canNext = clampedIndex < browse.length - 1;

  if (browse.length <= 1) {
    return <>{children(active, browse)}</>;
  }

  const panelAnimClass =
    direction === 'forward'
      ? styles['switcher__panel--slide-forward']
      : direction === 'backward'
        ? styles['switcher__panel--slide-backward']
        : styles['switcher__panel--fade'];

  return (
    <SwitcherTemplate
      canPrev = {
        canPrev
      }
      canNext = {
        canNext
      }
      onPrev = {
        () => {
          if (canPrev) setIndex(clampedIndex - 1, 'backward');
        }
      }
      onNext = {
        () => {
          if (canNext) setIndex(clampedIndex + 1, 'forward');
        }
      }
      content = {
        children(active, browse)
      }
      animationKey = {
        active.key
      }
      rootClassName = {
        [styles.switcher, className ?? ''].filter(Boolean).join(' ')
      }
      panelClassName = {
        `${styles['switcher__panel']} ${panelAnimClass}`
      }
      prevNavClassName = {
        `${styles['switcher__nav']} ${styles['switcher__nav--prev']}`
      }
      nextNavClassName = {
        `${styles['switcher__nav']} ${styles['switcher__nav--next']}`
      }
      ariaLabel = {
        SUBSTITUTION_SWITCH_LABEL
      }
    />
  );
};
