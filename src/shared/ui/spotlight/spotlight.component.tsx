import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { SpotlightProps } from './interfaces/spotlight-props.interface';
import type { SpotlightRect } from './interfaces/spotlight-rect.interface';
import { SpotlightTemplate } from './spotlight.html';
import { padRect } from './utils/measure-target.util';
import { resolveCardPosition } from './utils/resolve-card-position.util';

const DEFAULT_CARD = { width: 352, height: 180 };

export const Spotlight: React.FC<SpotlightProps> = ({
  targetRect,
  title,
  body,
  mode = 'step',
  progress,
  placement = 'bottom',
  showNext = true,
  nextLabel = 'Next',
  showBack = false,
  showSkip = true,
  skipLabel = 'Skip',
  isDialog = false,
  interactionHint,
  lockOutside = true,
  pad = 8,
  extraRects = [],
  onNext,
  onBack,
  onSkip,
  footerExtra,
  features = [],
  tutorialEnabled = true,
  onTutorialEnabledChange,
  onStart,
  onClose,
  startLabel = 'Start tutorial',
  closeLabel = 'Close',
  tutorialToggleLabel = 'Include hands-on tutorial',
  continueLabel = 'Continue',
  exitLabel = 'I’m done for now',
  onContinue,
  onExit,
}) => {
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const paddedRect = useMemo(
    () => (targetRect ? padRect(targetRect, pad) : null),
    [targetRect, pad]
  );
  const cutoutHoles = useMemo(() => {
    const holes: SpotlightRect[] = [];
    if (paddedRect) {
      holes.push(paddedRect);
    }
    for (const rect of extraRects) {
      holes.push(padRect(rect, pad));
    }
    return holes;
  }, [paddedRect, extraRects, pad]);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties | undefined>();
  const dialogLike = isDialog || mode === 'welcome' || mode === 'interstitial';

  useLayoutEffect(() => {
    if (!paddedRect || placement === 'center' || mode === 'welcome' || mode === 'interstitial') {
      setCardStyle(undefined);
      return;
    }

    const measure = () => {
      const el = cardRef.current;
      const size = el
        ? {
            width: el.offsetWidth || DEFAULT_CARD.width,
            height: el.offsetHeight || DEFAULT_CARD.height,
          }
        : DEFAULT_CARD;
      const pos = resolveCardPosition(paddedRect, placement, size);
      setCardStyle({ top: pos.top, left: pos.left });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [
    paddedRect,
    placement,
    title,
    body,
    progress,
    interactionHint,
    showNext,
    showBack,
    mode,
    tutorialEnabled,
  ]);

  useEffect(() => {
    if (!dialogLike) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const buttons = cardRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])');
    const primary = buttons && buttons.length > 0 ? buttons[buttons.length - 1] : null;
    primary?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogLike, title, mode]);

  useEffect(() => {
    if (!onSkip && !onClose && !onExit) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (mode === 'welcome' && onClose) {
        onClose();
        return;
      }

      if (mode === 'interstitial' && onExit) {
        onExit();
        return;
      }

      onSkip?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, onSkip, onClose, onExit]);

  return (
    <SpotlightTemplate
      targetRect = {
        targetRect
      }
      paddedRect = {
        paddedRect
      }
      cutoutHoles = {
        cutoutHoles
      }
      title = {
        title
      }
      body = {
        body
      }
      mode = {
        mode
      }
      progress = {
        progress
      }
      placement = {
        placement
      }
      showNext = {
        showNext
      }
      nextLabel = {
        nextLabel
      }
      showBack = {
        showBack
      }
      showSkip = {
        showSkip
      }
      skipLabel = {
        skipLabel
      }
      isDialog = {
        dialogLike
      }
      interactionHint = {
        interactionHint
      }
      lockOutside = {
        lockOutside
      }
      titleId = {
        titleId
      }
      cardRef = {
        cardRef
      }
      cardStyle = {
        cardStyle
      }
      onNext = {
        onNext
      }
      onBack = {
        onBack
      }
      onSkip = {
        onSkip
      }
      footerExtra = {
        footerExtra
      }
      features = {
        features
      }
      tutorialEnabled = {
        tutorialEnabled
      }
      onTutorialEnabledChange = {
        onTutorialEnabledChange
      }
      onStart = {
        onStart
      }
      onClose = {
        onClose
      }
      startLabel = {
        startLabel
      }
      closeLabel = {
        closeLabel
      }
      tutorialToggleLabel = {
        tutorialToggleLabel
      }
      continueLabel = {
        continueLabel
      }
      exitLabel = {
        exitLabel
      }
      onContinue = {
        onContinue
      }
      onExit = {
        onExit
      }
    />
  );
};
