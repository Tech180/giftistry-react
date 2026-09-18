import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { parseDateKey } from '../calendar/utils/parse-date-key.util';
import { positionSelectMenu } from '../select-menu/utils/position-select-menu.util';
import { DATE_FIELD_QUICK_PICKS } from './constants/date-field-quick-picks.constant';
import type { DateFieldProps } from './interfaces/date-field-props.interface';
import type { DateFieldQuickPickId } from './interfaces/date-field-quick-pick.interface';
import { DateFieldTemplate } from './date-field.html';
import {
  formatDateFieldDisplay,
  formatDateFieldEditValue,
} from './utils/format-date-field-display.util';
import { parseDateFieldInput } from './utils/parse-date-field-input.util';
import { resolveDateFieldQuickPick } from './utils/resolve-date-field-quick-pick.util';
import styles from './date-field.module.css';

export type { DateFieldProps } from './interfaces/date-field-props.interface';

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date...',
  disabled = false,
  clearable = true,
  className = '',
  id,
  'aria-label': ariaLabel,
}) => {
  const controlRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reactId = useId().replace(/:/g, '');
  const labelId = `date-field-label-${reactId}`;
  const inputId = id || `date-field-input-${reactId}`;
  const calendarButtonId = `date-field-calendar-${reactId}`;
  const dialogId = `date-field-dialog-${reactId}`;
  const resolvedAriaLabel = ariaLabel || label;

  const selectedDate = value.trim() ? value.trim() : null;
  const parsedSelected = parseDateKey(selectedDate);

  const [isOpen, setIsOpen] = useState(false);
  const [isPanelShown, setIsPanelShown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(() => formatDateFieldDisplay(selectedDate));
  const [viewMonth, setViewMonth] = useState(
    () => parsedSelected ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({
    top: 0,
    left: 0,
    visibility: 'hidden',
  });

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(formatDateFieldDisplay(selectedDate));
    }
  }, [selectedDate, isEditing]);

  const close = () => {
    setIsPanelShown(false);
    setIsOpen(false);
    calendarButtonRef.current?.focus();
  };

  const open = () => {
    if (disabled) {
      return;
    }
    setViewMonth(
      parsedSelected
        ? new Date(parsedSelected.getFullYear(), parsedSelected.getMonth(), 1)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    );
    setIsOpen(true);
  };

  const onOpenCalendar = () => {
    if (disabled) {
      return;
    }
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const onSelectDay = (dateKey: string) => {
    onChange(dateKey);
    setIsEditing(false);
    setDraftValue(formatDateFieldDisplay(dateKey));
    close();
  };

  const onQuickPick = (pickId: DateFieldQuickPickId) => {
    const next = resolveDateFieldQuickPick(pickId);
    onChange(next);
    setIsEditing(false);
    setDraftValue(formatDateFieldDisplay(next));
    close();
  };

  const onClear = () => {
    onChange('');
    setIsEditing(false);
    setDraftValue('');
    close();
  };

  const onDraftFocus = () => {
    setIsEditing(true);
    setDraftValue(formatDateFieldEditValue(selectedDate));
  };

  const onDraftCommit = () => {
    const trimmed = draftValue.trim();
    if (!trimmed) {
      if (selectedDate) {
        onChange('');
      }
      setIsEditing(false);
      setDraftValue('');
      return;
    }

    const parsed = parseDateFieldInput(trimmed);
    if (parsed) {
      if (parsed !== selectedDate) {
        onChange(parsed);
      }
      setIsEditing(false);
      setDraftValue(formatDateFieldDisplay(parsed));
      return;
    }

    setIsEditing(false);
    setDraftValue(formatDateFieldDisplay(selectedDate));
  };

  const onDraftKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onDraftCommit();
      inputRef.current?.blur();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsEditing(false);
      setDraftValue(formatDateFieldDisplay(selectedDate));
      inputRef.current?.blur();
      if (isOpen) {
        close();
      }
    }
  };

  useLayoutEffect(() => {
    if (!isOpen || !controlRef.current || !panelRef.current) {
      return;
    }

    const triggerRect = controlRef.current.getBoundingClientRect();
    const panelWidth = panelRef.current.getBoundingClientRect().width;
    const panelHeight = panelRef.current.getBoundingClientRect().height;
    const positioned = positionSelectMenu({
      triggerRect,
      menuWidth: panelWidth,
      menuHeight: panelHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      align: 'start',
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
  }, [isOpen, viewMonth, selectedDate]);

  useEffect(() => {
    if (!isOpen) {
      setIsPanelShown(false);
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (controlRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setIsPanelShown(false);
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    let allowScrollDismiss = false;
    const armScrollDismiss = window.setTimeout(() => {
      allowScrollDismiss = true;
    }, 0);

    const onScroll = (event: Event) => {
      if (!allowScrollDismiss) {
        return;
      }
      const target = event.target;
      if (
        target instanceof Node &&
        panelRef.current &&
        (panelRef.current === target || panelRef.current.contains(target))
      ) {
        return;
      }
      setIsPanelShown(false);
      setIsOpen(false);
    };

    const onResize = () => {
      setIsPanelShown(false);
      setIsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(armScrollDismiss);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen]);

  const rootClass = [styles.field, className].filter(Boolean).join(' ');
  const controlClass = [
    styles.control,
    isOpen ? styles['control-open'] : '',
    disabled ? styles['control-disabled'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const panelClass = [styles.panel, isPanelShown ? styles['panel-open'] : '']
    .filter(Boolean)
    .join(' ');

  return (
    <DateFieldTemplate
      rootClass={rootClass}
      controlClass={controlClass}
      panelClass={panelClass}
      panelStyle={panelStyle}
      label={label}
      labelId={labelId}
      inputId={inputId}
      calendarButtonId={calendarButtonId}
      dialogId={dialogId}
      ariaLabel={resolvedAriaLabel}
      draftValue={draftValue}
      placeholder={isEditing ? 'MM/DD/YYYY' : placeholder}
      isOpen={isOpen}
      disabled={disabled}
      clearable={clearable}
      hasValue={Boolean(selectedDate)}
      quickPicks={DATE_FIELD_QUICK_PICKS}
      viewMonth={viewMonth}
      selectedDate={selectedDate}
      controlRef={controlRef}
      calendarButtonRef={calendarButtonRef}
      panelRef={panelRef}
      inputRef={inputRef}
      calendarIcon={<CalendarIcon size={14} aria-hidden />}
      onDraftChange={setDraftValue}
      onDraftCommit={onDraftCommit}
      onDraftFocus={onDraftFocus}
      onDraftKeyDown={onDraftKeyDown}
      onOpenCalendar={onOpenCalendar}
      onSelectDay={onSelectDay}
      onViewMonthChange={setViewMonth}
      onQuickPick={onQuickPick}
      onClear={onClear}
    />
  );
};
