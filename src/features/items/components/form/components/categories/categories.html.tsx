import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button, Chip, NumberSelector } from 'shared/ui';
import {
  decodePrioritySelectorValue,
  encodePrioritySelectorValue,
} from '../../../../utils/parse-priority-weight.util';
import type { Props } from './interfaces/props.interface';
import styles from './categories.module.css';

export const CategoriesTemplate: React.FC<Props> = ({
  category,
  setCategory,
  priorityWeight,
  setPriorityWeight,
  renderedCategories,
  aiCategoryChips,
  aiCategoryIds,
  isAddingCustom,
  setIsAddingCustom,
  newCustomInput,
  setNewCustomInput,
  handleAddCustomCategory,
  handleDeleteCustomCategory,
  canShowAi = false,
  isSubstitutionSurface,
}) => {
  if (isSubstitutionSurface) {
    return null;
  }

  return (
    <div className={styles.categories}>
      <div className={styles['categories__form-group']}>
        <label className={styles['categories__label']}>Category</label>
        {canShowAi &&
          aiCategoryChips.length === 0 &&
          category === 'uncategorized' &&
          renderedCategories.every((cat) => !cat.isCustom && !cat.isFromList) && (
          <p className={styles['categories__ai-hint']}>
            Assigned automatically when you auto-fill from a product link.
          </p>
        )}
        <div className={styles['categories__chip-group']}>
          {aiCategoryChips.map((chip) => {
            const isSelected = category === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                className={[
                  styles['categories__ai-chip'],
                  chip.variant === 'suggestion' ? styles['categories__ai-chip--suggestion'] : '',
                  isSelected ? styles['categories__ai-chip--active'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setCategory(isSelected ? 'uncategorized' : chip.id)}
                aria-pressed={isSelected}
              >
                <Sparkles
                  size={11}
                  className={[
                    styles['categories__ai-icon'],
                    chip.variant === 'suggestion' && !isSelected
                      ? styles['categories__ai-icon--muted']
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                />
                <span>{chip.label}</span>
              </button>
            );
          })}
          {renderedCategories
            .filter((cat) => !canShowAi || cat.isCustom || cat.isFromList)
            .filter((cat) => !aiCategoryIds.has(cat.id))
            .map((cat) => {
              const isSelected = category === cat.id;
              if (cat.isCustom) {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={[
                      styles['categories__chip-custom'],
                      isSelected ? styles['categories__chip-custom--active'] : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setCategory(isSelected ? 'uncategorized' : cat.id)}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={styles['categories__delete-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomCategory(cat.id);
                      }}
                      title="Delete Category"
                    >
                      &times;
                    </span>
                  </button>
                );
              }
              return (
                <Chip
                  key={cat.id}
                  label={cat.label}
                  isActive={isSelected}
                  onClick={() => setCategory(isSelected ? 'uncategorized' : cat.id)}
                />
              );
            })}
          {!isAddingCustom ? (
            <Chip
              label="+ Add"
              onClick={() => {
                setIsAddingCustom(true);
                setNewCustomInput('');
              }}
              className={styles['categories__chip-dashed']}
            />
          ) : null}
        </div>
        {isAddingCustom && (
          <div className={`${styles['categories__custom-row']} animate-slide-up`}>
            <input
              type="text"
              className={styles['categories__custom-input']}
              placeholder="Category name..."
              value={newCustomInput}
              onChange={(e) => setNewCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomCategory();
                }
              }}
              autoFocus
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              className={styles['categories__add-btn-sm']}
              onClick={handleAddCustomCategory}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles['categories__add-btn-sm']}
              onClick={() => setIsAddingCustom(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className={styles['categories__form-group']}>
        <label className={styles['categories__label']}>
          Priority <span className={styles['categories__label-hint']}>(1 is highest)</span>
        </label>
        <NumberSelector
          value={encodePrioritySelectorValue(priorityWeight)}
          min={-1}
          dashValue={0}
          infinityValue={-1}
          onChange={(next) => setPriorityWeight(decodePrioritySelectorValue(next))}
          decreaseLabel="Decrease priority"
          increaseLabel="Increase priority"
          editLabel="Edit priority"
          className={styles['categories__qty-selector']}
        />
      </div>
    </div>
  );
};
