import type React from 'react';

export interface Props {
  isMultiCount: boolean;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  setVariations: React.Dispatch<React.SetStateAction<{ name: string; quantity: number }[]>>;
  varName: string;
  setVarName: (val: string) => void;
  varQty: number;
  setVarQty: (val: number) => void;
  variationQtyMax?: number;
  variationQtyDisabled?: boolean;
  variationQtyAllowInfinity?: boolean;
  varError: string | null;
  handleAddVariation: () => void;
}
