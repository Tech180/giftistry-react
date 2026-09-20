import { createClientLocalId } from 'shared/utils/client-local-id.util';

export function newLocalId(): string {
  return createClientLocalId('photo');
}
