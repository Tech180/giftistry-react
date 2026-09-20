import type { Item } from '../../../../../interfaces/item.interface';

export function itemSignature(items: Item[]): string {
  return items
    .map((item) => {
      const subFundingSignal = (item.SubstitutionOptions ?? [])
        .map(
          (option) =>
            `${option.Item.Id}:${option.Item.TotalClaimedAmount ?? ''}:${option.Item.Claims?.length ?? 0}`
        )
        .join(',');
      return [
        item.Id,
        item.Priority ?? '',
        item.IsSuggestion ? 1 : 0,
        item.Claims.length,
        item.Links.length,
        item.DesiredQuantity ?? '',
        item.SharedWith?.length ?? 0,
        item.FundingTarget ?? '',
        item.TotalClaimedAmount ?? '',
        subFundingSignal,
      ].join(':');
    })
    .join('|');
}
