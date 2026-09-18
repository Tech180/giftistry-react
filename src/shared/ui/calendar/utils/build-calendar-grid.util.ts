import type { CalendarDayCell } from '../interfaces/calendar-day-cell.interface';
import { formatDateKey } from './format-date-key.util';
import { isSameCalendarDay } from './is-same-calendar-day.util';

/**
 * Builds a Sunday-start calendar grid for the month containing `viewMonth`.
 * Includes leading/trailing days from adjacent months to fill complete weeks.
 */
export function buildCalendarGrid(viewMonth: Date, today: Date = new Date()): CalendarDayCell[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarDayCell[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i -= 1) {
    const dayNumber = daysInPrevMonth - i;
    const date = new Date(year, month - 1, dayNumber);
    cells.push({
      dateKey: formatDateKey(date),
      dayNumber,
      isCurrentMonth: false,
      isToday: isSameCalendarDay(date, today),
    });
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    const date = new Date(year, month, dayNumber);
    cells.push({
      dateKey: formatDateKey(date),
      dayNumber,
      isCurrentMonth: true,
      isToday: isSameCalendarDay(date, today),
    });
  }

  const totalCells = firstDayOfMonth + daysInMonth;
  const rowsNeeded = Math.ceil(totalCells / 7);
  const nextMonthCells = rowsNeeded * 7 - totalCells;

  for (let dayNumber = 1; dayNumber <= nextMonthCells; dayNumber += 1) {
    const date = new Date(year, month + 1, dayNumber);
    cells.push({
      dateKey: formatDateKey(date),
      dayNumber,
      isCurrentMonth: false,
      isToday: isSameCalendarDay(date, today),
    });
  }

  return cells;
}
