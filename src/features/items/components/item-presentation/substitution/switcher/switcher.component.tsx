import React, { useEffect, useRef, useState } from 'react';
import { resolveDisplayVariantIndex } from '../../../../utils/resolve-display-variant.util';
import { resolveItemSubstitutionOptions } from '../../../../utils/resolve-item-substitution-options.util';
import type { SubstitutionSwitcherProps } from './interfaces/substitution-switcher-props.interface';
import type { SubstitutionSlideDirection } from './interfaces/substitution-switcher-template-props.interface';
import { SubstitutionSwitcherTemplate } from './switcher.html';

export type { SubstitutionSwitcherProps } from './interfaces/substitution-switcher-props.interface';
export type { SubstitutionSlideDirection } from './interfaces/substitution-switcher-template-props.interface';

export const SubstitutionSwitcher: React.FC<SubstitutionSwitcherProps> = ({
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
  const [direction, setDirection] = useState<SubstitutionSlideDirection>('none');

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

  const setIndex = (index: number, slideDir?: SubstitutionSlideDirection) => {
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

  return (
    <SubstitutionSwitcherTemplate
      browse={browse}
      activeIndex={clampedIndex}
      canPrev={canPrev}
      canNext={canNext}
      direction={direction}
      onPrev={() => {
        if (canPrev) setIndex(clampedIndex - 1, 'backward');
      }}
      onNext={() => {
        if (canNext) setIndex(clampedIndex + 1, 'forward');
      }}
      content={children(active, browse)}
      animationKey={active.key}
      className={className}
    />
  );
};

