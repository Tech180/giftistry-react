import type { CollapsibleStripStatus } from 'shared/ui';
import type { Phase } from '../interfaces/phase.type';
import type { BuildStatusOptions } from '../interfaces/build-status-options.interface';

export function buildStatus(phase: Phase, options: BuildStatusOptions): CollapsibleStripStatus | undefined {
  switch (phase) {
    case 'uploading':
      return {
        tone: 'progress',
        message: `Uploading ${options.uploadPercent}%`,
      };
    case 'ready':
    case 'creating':
      return undefined;
    case 'success':
      return {
        tone: options.successTone ?? 'success',
        message:
          options.successMessage ||
          (options.mode === 'create-list'
            ? `Import finished for “${options.wishlistTitle}”`
            : 'Import finished'),
      };
    case 'error':
      return {
        tone: 'error',
        message: options.errorMessage || 'Import failed',
      };
    default:
      return { tone: 'idle', message: 'Drop a file or browse to import' };
  }
}
