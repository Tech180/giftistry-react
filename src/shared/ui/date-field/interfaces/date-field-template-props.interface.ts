import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from 'react';
import type { DateFieldQuickPick } from './date-field-quick-pick.interface';

export interface DateFieldTemplateProps {
  rootClass: string;
  controlClass: string;
  panelClass: string;
  panelStyle: CSSProperties;
  label?: string;
  labelId: string;
  inputId: string;
  calendarButtonId: string;
  dialogId: string;
  ariaLabel?: string;
  draftValue: string;
  placeholder: string;
  isOpen: boolean;
  disabled: boolean;
  clearable: boolean;
  hasValue: boolean;
  quickPicks: DateFieldQuickPick[];
  viewMonth: Date;
  selectedDate: string | null;
  controlRef: RefObject<HTMLDivElement | null>;
  calendarButtonRef: RefObject<HTMLButtonElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  calendarIcon: ReactNode;
  onDraftChange: (next: string) => void;
  onDraftCommit: () => void;
  onDraftFocus: () => void;
  onDraftKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onOpenCalendar: () => void;
  onSelectDay: (dateKey: string) => void;
  onViewMonthChange: (nextMonth: Date) => void;
  onQuickPick: (id: DateFieldQuickPick['id']) => void;
  onClear: () => void;
}
