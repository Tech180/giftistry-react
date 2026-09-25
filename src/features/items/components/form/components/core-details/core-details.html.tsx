import React from 'react';
import { Globe, DollarSign, Star, Pin } from 'lucide-react';
import { TOUR_TARGETS } from 'features/tour';
import { NumberSelector } from 'shared/ui';
import type { Props } from './interfaces/props.interface';
import styles from './core-details.module.css';

export const CoreDetailsTemplate: React.FC<Props> = ({
  websiteName,
  setWebsiteName,
  name,
  setName,
  price,
  setPrice,
  desiredQuantity,
  setDesiredQuantity,
  isFavorite,
  setIsFavorite,
  canCollaborate,
  hideFavorite,
}) => (
  <div className={styles['core-details']}>
    <div className={styles['core-details__form-group']}>
      <label className={styles['core-details__label']}>Website Name</label>
      <div className={styles['core-details__input-wrapper']}>
        <span className={styles['core-details__input-icon']}><Globe size={14} /></span>
        <input
          type="text"
          className={`${styles['core-details__input']} ${styles['core-details__input--has-icon']}`}
          placeholder="Amazon, Target"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
        />
      </div>
    </div>

    <div className={styles['core-details__form-group']}>
      <label className={styles['core-details__label']}>
        Item Name <span className={styles['core-details__required']}>*</span>
      </label>
      <input
        type="text"
        className={styles['core-details__input']}
        placeholder="e.g. Sony WH-1000XM5"
        value={name}
        onChange={(e) => setName(e.target.value)}
        data-tour={TOUR_TARGETS.addItemName}
        required
      />
    </div>

    <div className={styles['core-details__form-row']}>
      <div className={styles['core-details__form-group']}>
        <label className={styles['core-details__label']}>Price</label>
        <div className={styles['core-details__input-wrapper']}>
          <span className={styles['core-details__input-icon']}><DollarSign size={14} /></span>
          <input
            type="text"
            className={`${styles['core-details__input']} ${styles['core-details__input--has-icon']}`}
            placeholder="0.00"
            value={price}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(val)) {
                setPrice(val);
              }
            }}
          />
        </div>
      </div>
      <div className={styles['core-details__form-group']}>
        <label className={styles['core-details__label']}>Qty</label>
        <NumberSelector
          value={typeof desiredQuantity === 'number' ? desiredQuantity : 1}
          min={0}
          onChange={setDesiredQuantity}
          decreaseLabel="Decrease quantity"
          increaseLabel="Increase quantity"
          zeroAsInfinity
          className={styles['core-details__qty-selector']}
        />
      </div>
      {!hideFavorite ? (
        <div className={styles['core-details__form-group']}>
          <label
            className={`${styles['core-details__label']} ${styles['core-details__label--center']}`}
          >
            {canCollaborate ? 'Favorite' : 'Pin'}
          </label>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={[
              styles['core-details__btn-star'],
              isFavorite
                ? (canCollaborate
                  ? styles['core-details__btn-star--favorite']
                  : styles['core-details__btn-star--pin'])
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            title={canCollaborate
              ? (isFavorite ? 'Remove Favorite' : 'Mark as Favorite')
              : (isFavorite ? 'Unpin Item' : 'Pin Item')}
          >
            {canCollaborate ? (
              <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            ) : (
              <Pin
                size={16}
                fill={isFavorite ? 'currentColor' : 'none'}
                style={{ transform: isFavorite ? 'rotate(45deg)' : 'none' }}
              />
            )}
          </button>
        </div>
      ) : null}
    </div>
  </div>
);
