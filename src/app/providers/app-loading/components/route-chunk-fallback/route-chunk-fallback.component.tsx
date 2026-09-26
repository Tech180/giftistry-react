import { useLocation } from 'react-router-dom';
import { useAppLoadingGate } from '../../hooks/use-app-loading-gate';
import { chunkLoadingMessage } from '../../utils/chunk-loading-message.util';

/** Suspense fallback: drives app loading host while a lazy route chunk loads. */
export function RouteChunkFallback(): null {
  const { pathname } = useLocation();
  useAppLoadingGate(true, chunkLoadingMessage(pathname));
  return null;
}
