import React, { useEffect, useRef, useState } from 'react';
import { jobsApi } from 'features/jobs';
import { isValidUrl } from 'shared/utils/is-valid-url.util';
import { BUSY_HINT, IDLE_HINT } from './constants/hints.constant';
import { MOBILE_MENU_QUERY } from './constants/mobile-menu-query.constant';
import type { Props } from './interfaces/props.interface';
import { getBarClassName } from './utils/get-bar-class-name.util';
import { getRootClassName } from './utils/get-root-class-name.util';
import { AddWidgetTemplate } from './add-widget.html';

export const AddWidget: React.FC<Props> = ({
  listId,
  isInputMode,
  canAutoAdd,
  onEnterInputMode,
  onExitInputMode,
  onManual,
  onStarted,
}) => {
  const effectiveInputMode = isInputMode && canAutoAdd;
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(MOBILE_MENU_QUERY).matches;
  });
  const urlInputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_MENU_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileViewport(event.matches);
      if (!event.matches) {
        setIsMenuOpen(false);
      }
    };

    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!effectiveInputMode) {
      setUrl('');
      setErrorMsg(null);
      setIsSubmitting(false);
      return;
    }

    setIsMenuOpen(false);
    const focusTimer = window.setTimeout(() => {
      urlInputRef.current?.focus();
    }, 150);

    return () => window.clearTimeout(focusTimer);
  }, [effectiveInputMode]);

  useEffect(() => {
    if (!isMenuOpen || !isMobileViewport) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && widgetRef.current?.contains(target)) {
        return;
      }
      setIsMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isMenuOpen, isMobileViewport]);

  const handleExitInputMode = () => {
    if (isSubmitting) {
      return;
    }
    setUrl('');
    setErrorMsg(null);
    onExitInputMode();
  };

  const handleToggleMenu = () => {
    if (effectiveInputMode || !isMobileViewport) {
      return;
    }
    setIsMenuOpen((prev) => !prev);
  };

  const handleEnterInputMode = () => {
    if (!canAutoAdd) {
      return;
    }
    setIsMenuOpen(false);
    onEnterInputMode();
  };

  const handleManual = () => {
    setIsMenuOpen(false);
    onManual();
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (errorMsg) {
      setErrorMsg(null);
    }
  };

  const handleIconTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleToggleMenu();
  };

  const handleAutoClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleEnterInputMode();
  };

  const handleManualClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleManual();
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAutoAdd || isSubmitting) {
      return;
    }

    const trimmed = url.trim();
    if (!trimmed || !isValidUrl(trimmed)) {
      setErrorMsg('Please enter a valid product URL.');
      urlInputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await jobsApi.startItemEnrich({
        intent: 'create-from-url',
        listId,
        url: trimmed,
        writeBack: true,
      });
      setUrl('');
      onStarted(result);
      onExitInputMode();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to start auto-add.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpanded = !effectiveInputMode && isMenuOpen;

  return (
    <AddWidgetTemplate
      isInputMode = {
        effectiveInputMode
      }
      isMenuOpen = {
        isMenuOpen
      }
      isExpanded = {
        isExpanded
      }
      canAutoAdd = {
        canAutoAdd
      }
      url = {
        url
      }
      errorMsg = {
        errorMsg
      }
      isSubmitting = {
        isSubmitting
      }
      hintText = {
        isSubmitting ? BUSY_HINT : IDLE_HINT
      }
      menuToggleLabel = {
        isMenuOpen ? 'Close add options' : 'Open add options'
      }
      actionTabIndex = {
        isMenuOpen || !effectiveInputMode ? 0 : -1
      }
      rootClassName = {
        getRootClassName(effectiveInputMode, canAutoAdd)
      }
      barClassName = {
        getBarClassName(effectiveInputMode, isExpanded, canAutoAdd)
      }
      urlInputRef = {
        urlInputRef
      }
      widgetRef = {
        widgetRef
      }
      onUrlChange = {
        handleUrlChange
      }
      onIconTriggerClick = {
        handleIconTriggerClick
      }
      onAutoClick = {
        handleAutoClick
      }
      onManualClick = {
        handleManualClick
      }
      onExitInputMode = {
        handleExitInputMode
      }
      onSubmit = {
        handleSubmit
      }
    />
  );
};
