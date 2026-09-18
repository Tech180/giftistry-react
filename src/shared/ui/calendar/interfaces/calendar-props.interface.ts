export interface CalendarProps {
  /** Any date within the month currently displayed. */
  viewMonth: Date;
  /** Selected day as YYYY-MM-DD, or null/empty when none. */
  selectedDate: string | null;
  onSelectDay: (dateKey: string) => void;
  onViewMonthChange: (nextMonth: Date) => void;
  className?: string;
  id?: string;
}
