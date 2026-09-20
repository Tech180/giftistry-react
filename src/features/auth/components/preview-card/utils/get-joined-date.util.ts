import { getJoinedDate as formatJoinedDate } from 'shared/utils/get-initials.util';

export function getJoinedDate(createdAt?: string): string {
  return formatJoinedDate(createdAt);
}
