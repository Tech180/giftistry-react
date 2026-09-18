export type DateFieldQuickPickId = 'today' | 'tomorrow' | 'next-week' | 'next-month';

export interface DateFieldQuickPick {
  id: DateFieldQuickPickId;
  label: string;
}
