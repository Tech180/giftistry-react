export function getDashboardGreeting(
  name: string,
  hours: number = new Date().getHours()
): string {
  if (hours < 12) return `Good morning, ${name}`;
  if (hours < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}
