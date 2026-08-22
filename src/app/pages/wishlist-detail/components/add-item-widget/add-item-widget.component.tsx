import React, { useEffect, useRef, useState } from 'react';
import { jobsApi } from 'features/jobs';
import { isValidUrl } from 'shared/utils/is-valid-url.util';
import { AddItemWidgetProps } from './interfaces/add-item-widget-props.interface';
import { AddItemWidgetTemplate } from './add-item-widget.html';

const MOBILE_MENU_QUERY = '(max-width: 48rem)';

export const AddItemWidget: React.FC<AddItemWidgetProps> = ({
  listId,
  isInputMode,
  canAutoAdd,
  onEnterInputMode,
  onExitInputMode,
  onManual,
  onStarted,
}) => {
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(MOBILE_MENU_QUERY).matches;
  });
  const urlInputRef = useRef<HTMLInputElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(MOBILE_MENU_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileViewport(event.matches);
      if (!event.matches) setIsMenuOpen(false);
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
    if (!isInputMode) {
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
  }, [isInputMode]);

  useEffect(() => {
    if (!isMenuOpen || !isMobileViewport) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && widgetRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isMenuOpen, isMobileViewport]);

  const handleExitInputMode = () => {
    if (isSubmitting) return;
    setUrl('');
    setErrorMsg(null);
    onExitInputMode();
  };

  const handleToggleMenu = () => {
    if (isInputMode) return;
    setIsMenuOpen((prev) => !prev);
  };

  const handleEnterInputMode = () => {
    if (!canAutoAdd) return;
    setIsMenuOpen(false);
    onEnterInputMode();
  };

  const handleManual = () => {
    setIsMenuOpen(false);
    onManual();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canAutoAdd || isSubmitting) return;

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

  return (
    <AddItemWidgetTemplate
      isInputMode={isInputMode && canAutoAdd}
      isMenuOpen={isMenuOpen}
      canAutoAdd={canAutoAdd}
      url={url}
      setUrl={(value) => {
        setUrl(value);
        if (errorMsg) setErrorMsg(null);
      }}
      errorMsg={errorMsg}
      isSubmitting={isSubmitting}
      urlInputRef={urlInputRef}
      widgetRef={widgetRef}
      onToggleMenu={handleToggleMenu}
      onEnterInputMode={handleEnterInputMode}
      onExitInputMode={handleExitInputMode}
      onManual={handleManual}
      handleSubmit={handleSubmit}
    />
  );
};
