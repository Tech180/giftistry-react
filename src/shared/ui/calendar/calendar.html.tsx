import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarTemplateProps } from './interfaces/calendar-template-props.interface';
import styles from './calendar.module.css';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const CalendarTemplate: React.FC<CalendarTemplateProps> = ({
  monthYearLabel,
  days,
  selectedDate,
  className,
  id,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}) => {
  return (
    <div className={`${styles.calendar} ${className}`.trim()} id={id}>
      <div className={styles.header}>
        <h3 className={styles.title} aria-live="polite">
          {monthYearLabel}
        </h3>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles['nav-btn']}
            onClick={onPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={14} aria-hidden />
          </button>
          <button
            type="button"
            className={styles['nav-btn']}
            onClick={onNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={14} aria-hidden />
          </button>
        </div>
      </div>

      <div className={styles.grid} role="grid" aria-label={monthYearLabel}>
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className={styles.weekday} role="columnheader">
            {weekday}
          </div>
        ))}
        {days.map((day) => {
          const isSelected = selectedDate === day.dateKey;
          const dayClass = [
            styles['day-btn'],
            day.isCurrentMonth ? '' : styles['day-other-month'],
            day.isToday ? styles['day-today'] : '',
            isSelected ? styles['day-selected'] : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={day.dateKey}
              type="button"
              className={dayClass}
              role="gridcell"
              aria-selected={isSelected}
              aria-label={day.dateKey}
              onClick={() => onSelectDay(day.dateKey)}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};
