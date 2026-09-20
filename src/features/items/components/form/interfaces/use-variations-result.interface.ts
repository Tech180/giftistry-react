import type React from 'react';

export interface UseVariationsResult {
  varName: string;
  setVarName: React.Dispatch<React.SetStateAction<string>>;
  varQty: number;
  setVarQty: React.Dispatch<React.SetStateAction<number>>;
  varError: string | null;
  variationQtyMax: number | undefined;
  variationQtyDisabled: boolean;
  variationQtyAllowInfinity: boolean;
  handleAddVariation: () => void;
}
