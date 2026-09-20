export function getDaysUntilBirthday(dateStr?: string | null): number {
  if (!dateStr) {
    return 999;
  }

  const now = new Date();
  const bday = new Date(dateStr);
  bday.setFullYear(now.getFullYear());
  if (bday < now && now.getTime() - bday.getTime() > 86400000) {
    bday.setFullYear(now.getFullYear() + 1);
  }

  const diff = Math.ceil((bday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}
