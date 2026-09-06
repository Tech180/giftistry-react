import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { SelectMenuProps } from './interfaces/select-menu-props.interface';
import { SelectMenuTemplate } from './select-menu.html';
import { positionSelectMenu } from './utils/position-select-menu.util';
import styles from './select-menu.module.css';

export type { SelectMenuProps } from './interfaces/select-menu-props.interface';
export type { SelectMenuOption } from './interfaces/select-menu-option.interface';

export const SelectMenu: React.FC<SelectMenuProps> = ({
  value,
  options,
  onChange,
  disabled = false,
  variant = 'compact',
  menuTitle,
  'aria-label': ariaLabel,
  className = '',
  id,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId().replace(/:/g, '');
  const [isOpen, setIsOpen] = useState(false);
  const [isPanelShown, setIsPanelShown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({
    top: 0,
    left: 0,
    visibility: 'hidden',
  });

  const selected = options.find((option) => option.value === value);
  const selectedLabel = selected?.label ?? value;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  const close = () => {
    setIsPanelShown(false);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const open = () => {
    if (disabled) {
      return;
    }
    setFocusedIndex(selectedIndex);
    setIsOpen(true);
  };

  const onToggle = () => {
    if (disabled) {
      return;
    }
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const onSelect = (nextValue: string) => {
    onChange(nextValue);
    close();
  };

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const positioned = positionSelectMenu({
      triggerRect,
      menuWidth: menuRect.width,
      menuHeight: menuRect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });

    setPanelStyle({
      top: positioned.top,
      left: positioned.left,
      transformOrigin: positioned.transformOrigin,
      visibility: 'visible',
    });

    const frame = requestAnimationFrame(() => {
      setIsPanelShown(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen, options, menuTitle]);

  useEffect(() => {
    if (!isOpen) {
      setIsPanelShown(false);
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setIsPanelShown(false);
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((index) => (index + 1) % options.length);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((index) => (index - 1 + options.length) % options.length);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setFocusedIndex(0);
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        setFocusedIndex(Math.max(0, options.length - 1));
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const option = options[focusedIndex];
        if (option && !option.disabled) {
          onSelect(option.value);
        }
      }
    };

    const onScrollOrResize = () => {
      setIsPanelShown(false);
      setIsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen, options, focusedIndex]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) {
      return;
    }
    const focused = menuRef.current.querySelectorAll('[role="option"]')[focusedIndex] as
      | HTMLElement
      | undefined;
    if (typeof focused?.scrollIntoView === 'function') {
      focused.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  const triggerClass = [
    styles.trigger,
    variant === 'field' ? styles['trigger-field'] : '',
    isOpen ? styles['trigger-open'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const panelClass = [styles.panel, isPanelShown ? styles['panel-open'] : '']
    .filter(Boolean)
    .join(' ');

  const chevronClass = [styles.chevron, isOpen ? styles['chevron-open'] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <SelectMenuTemplate
      triggerRef={triggerRef}
      menuRef={menuRef}
      listboxId={`select-menu-${listboxId}`}
      isOpen={isOpen}
      disabled={disabled}
      triggerClass={triggerClass}
      panelClass={panelClass}
      panelStyle={panelStyle}
      selectedLabel={selectedLabel}
      menuTitle={menuTitle}
      options={options}
      focusedIndex={focusedIndex}
      value={value}
      ariaLabel={ariaLabel}
      id={id}
      checkIcon={<Check size={14} strokeWidth={3} aria-hidden />}
      chevronSize={variant === 'field' ? 14 : 12}
      chevronClass={chevronClass}
      onToggle={onToggle}
      onSelect={onSelect}
      onOptionMouseEnter={setFocusedIndex}
    />
  );
};
