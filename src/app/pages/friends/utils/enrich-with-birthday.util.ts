import type { Friend } from 'features/friends';
import { getDaysUntilBirthday } from './get-days-until-birthday.util';

export function enrichWithBirthday(friends: Friend[]): Friend[] {
  return friends.map((f) => ({
    ...f,
    DaysUntilBirthday: f.Birthday ? getDaysUntilBirthday(f.Birthday) : 999,
  }));
}
