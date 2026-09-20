export function formatJoinedDisplay(joinedLabel: string): string {
  return joinedLabel.startsWith('Joined ') ? joinedLabel.slice(7) : joinedLabel;
}
