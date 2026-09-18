import React from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from '../calendar/calendar.component';
import type { DateFieldTemplateProps } from './interfaces/date-field-template-props.interface';
import styles from './date-field.module.css';

export const DateFieldTemplate: React.FC<DateFieldTemplateProps> = ({
  rootClass,
  controlClass,
  panelClass,
  panelStyle,
  label,
  labelId,
  inputId,
  calendarButtonId,
  dialogId,
  ariaLabel,
  draftValue,
  placeholder,
  isOpen,
  disabled,
  clearable,
  hasValue,
  quickPicks,
  viewMonth,
  selectedDate,
  controlRef,
  calendarButtonRef,
  panelRef,
  inputRef,
  calendarIcon,
  onDraftChange,
  onDraftCommit,
  onDraftFocus,
  onDraftKeyDown,
  onOpenCalendar,
  onSelectDay,
  onViewMonthChange,
  onQuickPick,
  onClear,
}) => {
  const panel =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={panelRef}
            id={dialogId}
            className={panelClass}
            style={panelStyle}
            role="dialog"
            aria-label={label ? `Choose ${label}` : 'Choose date'}
            aria-modal="true"
          >
            <div className={styles['quick-picks']}>
              {quickPicks.map((pick) => (
                <button
                  key={pick.id}
                  type="button"
                  className={styles['quick-pick-btn']}
                  onClick={() => onQuickPick(pick.id)}
                >
                  {pick.label}
                </button>
              ))}
              <div className={styles['quick-pick-spacer']} aria-hidden />
              {clearable && hasValue ? (
                <button
                  type="button"
                  className={`${styles['quick-pick-btn']} ${styles['clear-btn']}`}
                  onClick={onClear}
                >
                  Clear selection
                </button>
              ) : null}
            </div>
            <Calendar
              viewMonth={viewMonth}
              selectedDate={selectedDate}
              onSelectDay={onSelectDay}
              onViewMonthChange={onViewMonthChange}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <div className={rootClass}>
      {label ? (
        <label id={labelId} htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}
      <div ref={controlRef} className={controlClass}>
        <button
          ref={calendarButtonRef}
          type="button"
          id={calendarButtonId}
          className={[
            styles['calendar-btn'],
            isOpen ? styles['calendar-btn-open'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={dialogId}
          aria-label="Open calendar"
          onClick={onOpenCalendar}
        >
          {calendarIcon}
        </button>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={styles.input}
          value={draftValue}
          placeholder={placeholder}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          aria-label={label ? undefined : ariaLabel}
          aria-labelledby={label ? labelId : undefined}
          onChange={(event) => onDraftChange(event.target.value)}
          onFocus={onDraftFocus}
          onBlur={onDraftCommit}
          onKeyDown={onDraftKeyDown}
        />
      </div>
      {panel}
    </div>
  );
};
