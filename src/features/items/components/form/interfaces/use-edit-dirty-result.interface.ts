import type React from 'react';

export interface UseEditDirtyResult {
  isEditDirty: boolean;
  buildEditSnapshot: () => string;
  initialEditSnapshotRef: React.RefObject<string | null>;
}
