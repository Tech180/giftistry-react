export interface CalendarDayCell {
  /** Local calendar date as YYYY-MM-DD */
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}
