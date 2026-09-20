export function isBirthdayNear(daysUntilBirthday?: number): boolean {
  return daysUntilBirthday !== undefined && daysUntilBirthday <= 30;
}
