import { useEffect, useState } from 'react';
import type React from 'react';
import type { UseVariationsResult } from '../interfaces/use-variations-result.interface';

export function useVariations(options: {
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  setVariations: React.Dispatch<React.SetStateAction<{ name: string; quantity: number }[]>>;
}): UseVariationsResult {
  const { desiredQuantity, variations, setVariations } = options;

  const [varName, setVarName] = useState('');
  const [varQty, setVarQty] = useState(1);
  const [varError, setVarError] = useState<string | null>(null);

  const variationFiniteTotal = variations.reduce(
    (sum, variation) => sum + (variation.quantity > 0 ? variation.quantity : 0),
    0
  );
  const variationQtyRemaining =
    typeof desiredQuantity === 'number' && desiredQuantity === 0
      ? null
      : typeof desiredQuantity === 'number'
        ? Math.max(0, desiredQuantity - variationFiniteTotal)
        : 0;
  const variationQtyMax = variationQtyRemaining === null ? undefined : variationQtyRemaining;
  const variationQtyDisabled = variationQtyRemaining !== null && variationQtyRemaining <= 0;
  const variationQtyAllowInfinity = typeof desiredQuantity === 'number' && desiredQuantity === 0;

  useEffect(() => {
    setVarError(null);
  }, [desiredQuantity, variations]);

  useEffect(() => {
    if (variationQtyAllowInfinity) {
      return;
    }
    if (varQty === 0) {
      setVarQty(1);
    }
    if (variations.some((variation) => variation.quantity === 0)) {
      setVariations((prev) =>
        prev.map((variation) =>
          variation.quantity === 0 ? { ...variation, quantity: 1 } : variation
        )
      );
    }
  }, [variationQtyAllowInfinity, varQty, variations, setVariations]);

  useEffect(() => {
    if (variationQtyRemaining === null) {
      return;
    }
    if (variationQtyRemaining <= 0) {
      if (varQty !== 1) {
        setVarQty(1);
      }
      return;
    }
    if (varQty > variationQtyRemaining) {
      setVarQty(variationQtyRemaining);
    }
  }, [variationQtyRemaining, varQty]);

  const handleAddVariation = () => {
    if (!varName.trim()) {
      return;
    }
    if (variationQtyDisabled) {
      setVarError('Cannot exceed the total quantity limit.');
      return;
    }
    if (varQty === 0 && !variationQtyAllowInfinity) {
      setVarError('Unlimited variation quantity requires unlimited item quantity.');
      return;
    }
    const remaining = variationQtyRemaining ?? Number.POSITIVE_INFINITY;

    if (varQty > 0 && varQty > remaining) {
      setVarError('Cannot exceed the total quantity limit.');
      return;
    }

    setVarError(null);
    setVariations((prev) => [...prev, { name: varName.trim(), quantity: varQty }]);
    setVarName('');
    setVarQty(1);
  };

  return {
    varName,
    setVarName,
    varQty,
    setVarQty,
    varError,
    variationQtyMax,
    variationQtyDisabled,
    variationQtyAllowInfinity,
    handleAddVariation,
  };
}
