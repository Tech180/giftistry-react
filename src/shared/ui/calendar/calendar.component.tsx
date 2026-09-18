import React from 'react';
import type { CalendarProps } from './interfaces/calendar-props.interface';
import { CalendarTemplate } from './calendar.html';
import { buildCalendarGrid } from './utils/build-calendar-grid.util';

export type { CalendarProps } from './interfaces/calendar-props.interface';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const Calendar: React.FC<CalendarProps> = ({
  viewMonth,
  selectedDate,
  onSelectDay,
  onViewMonthChange,
  className = '',
  id,
}) => {
  const days = buildCalendarGrid(viewMonth);
  const monthYearLabel = `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  const onPrevMonth = () => {
    onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };

  const onNextMonth = () => {
    onViewMonthChange(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  return (
    <CalendarTemplate
      monthYearLabel={monthYearLabel}
      days={days}
      selectedDate={selectedDate}
      className={className}
      id={id}
      onPrevMonth={onPrevMonth}
      onNextMonth={onNextMonth}
      onSelectDay={onSelectDay}
    />
  );
};
