import React from 'react';
import type { CalendarProps } from './interfaces/calendar-props.interface';
import { CalendarTemplate } from './calendar.html';
import { MONTH_NAMES } from './constants/month-names.constant';
import { buildCalendarGrid } from './utils/build-calendar-grid.util';

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
      monthYearLabel = {
        monthYearLabel
      }
      days = {
        days
      }
      selectedDate = {
        selectedDate
      }
      className = {
        className
      }
      id = {
        id
      }
      onPrevMonth = {
        onPrevMonth
      }
      onNextMonth = {
        onNextMonth
      }
      onSelectDay = {
        onSelectDay
      }
    />
  );
};
