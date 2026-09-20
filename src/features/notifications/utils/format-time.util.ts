import { formatRelativePast } from 'shared/utils/format-date.util';
import { FORMAT_TIME_OPTIONS } from '../constants/format-time-options.constant';

export function formatTime(dateStr: string): string {
  return formatRelativePast(dateStr, FORMAT_TIME_OPTIONS);
}
