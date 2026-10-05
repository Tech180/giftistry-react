/** Row count for list settings menu layout (group funding + rollover + optional AI rows). */
export function countListSettingsPanelRows(options: {
  canShowAi: boolean;
  canShowWebSearch: boolean;
}): number {
  const { canShowAi, canShowWebSearch } = options;
  return 2 + (canShowAi ? 1 : 0) + (canShowWebSearch ? 1 : 0) + (canShowAi ? 1 : 0);
}
