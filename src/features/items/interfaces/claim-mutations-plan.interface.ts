import type { ClaimItemParams } from './item-actions.interface';

export type ClaimMutationsPlan =
  | { type: 'noop' }
  | { type: 'unclaim-all' }
  | { type: 'create'; requests: ClaimItemParams[] }
  | { type: 'replace'; requests: ClaimItemParams[] };
