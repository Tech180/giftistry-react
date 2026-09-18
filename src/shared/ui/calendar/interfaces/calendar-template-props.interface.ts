import type { CalendarDayCell } from './calendar-day-cell.interface';

export interface CalendarTemplateProps {
  monthYearLabel: string;
  days: CalendarDayCell[];
  selectedDate: string | null;
  className: string;
  id?: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (dateKey: string) => void;
}
