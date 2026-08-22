export function isTechnologyPack(packId: string): boolean {
  return packId === 'technology' || packId.startsWith('technology.');
}
