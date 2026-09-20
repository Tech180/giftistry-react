import type React from 'react';

export interface UseSubmitItemResult {
  handleSubmit: (e: React.SyntheticEvent) => Promise<void>;
}
