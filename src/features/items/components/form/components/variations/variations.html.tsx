import React from 'react';
import { Button, NumberSelector } from 'shared/ui';
import type { Props } from './interfaces/props.interface';
import styles from './variations.module.css';

export const VariationsTemplate: React.FC<Props> = ({
  isMultiCount,
  desiredQuantity,
  variations,
  setVariations,
  varName,
  setVarName,
  varQty,
  setVarQty,
  variationQtyMax,
  variationQtyDisabled = false,
  variationQtyAllowInfinity = false,
  varError,
  handleAddVariation,
}) => {
  if (!isMultiCount || typeof desiredQuantity !== 'number') {
    return null;
  }

  return (
    <div className={styles.variations}>
      <span className={styles['variations__badge']}>
        {variations.reduce(
          (sum, variation) => sum + (variation.quantity > 0 ? variation.quantity : 0),
          0
        )}
        {variations.some((variation) => variation.quantity === 0) ? '+∞' : ''}/
        {desiredQuantity === 0 ? '∞' : desiredQuantity}
      </span>
      <label className={styles['variations__label']}>Item Variations</label>
      {varError && (
        <div className={styles['variations__alert']}><span>{varError}</span></div>
      )}
      <div className={styles['variations__row']}>
        <input
          type="text"
          className={styles['variations__name']}
          placeholder="e.g. Red, Size M"
          value={varName}
          onChange={(e) => setVarName(e.target.value)}
        />
        <NumberSelector
          value={varQty}
          min={variationQtyAllowInfinity ? 0 : 1}
          max={variationQtyMax}
          onChange={setVarQty}
          disabled={variationQtyDisabled}
          zeroAsInfinity={variationQtyAllowInfinity}
          decreaseLabel="Decrease variation quantity"
          increaseLabel="Increase variation quantity"
          editLabel="Edit variation quantity"
          className={styles['variations__qty-selector']}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className={styles['variations__add-btn-sm']}
          onClick={handleAddVariation}
          disabled={variationQtyDisabled}
        >
          Add
        </Button>
      </div>
      <div className={styles['variations__list']}>
        {variations.map((v, idx) => (
          <span key={idx} className={styles['variations__chip']}>
            {v.name} ({v.quantity === 0 ? '∞' : v.quantity})
            <button
              type="button"
              onClick={() => setVariations((prev) => prev.filter((_, i) => i !== idx))}
              className={styles['variations__remove-btn']}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
