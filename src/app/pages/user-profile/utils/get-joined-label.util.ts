export function getJoinedLabel(joinedDate: string): string {
  if (joinedDate.startsWith('Joined ')) {
    return joinedDate.substring(7);
  }

  return joinedDate;
}
