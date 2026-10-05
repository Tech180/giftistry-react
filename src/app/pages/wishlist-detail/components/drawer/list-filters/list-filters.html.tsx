import React from 'react';
import { ArrowRight } from 'lucide-react';
import categoryFieldStyles from 'features/items/components/form/components/categories/categories.module.css';
import { Drawer, Button, Chip, NumberSelector, SelectMenu } from 'shared/ui';
import { FilterSwitchRow } from './components/filter-switch-row/filter-switch-row.component';
import { SectionDivider } from './components/section-divider/section-divider.component';
import { FilterChipGroup } from './components/filter-chip-group/filter-chip-group.component';
import {
  LIST_FUNDING_FILTER_MENU_TITLE,
  LIST_FUNDING_FILTER_OPTIONS,
} from './constants/funding-filter-options.constant';
import {
  LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR,
  listPriceMaxSelectorValueToString,
  listPriceMinSelectorValueToString,
  resolveListPriceMaxSelectorChange,
} from './utils/list-price-range-selector.util';
import styles from './list-filters.module.css';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ListFiltersTemplate: React.FC<TemplateProps> = ({
  isDrawerOpen,
  onClose,
  draft,
  capabilities,
  categoryOptions,
  hasUnsavedDraft,
  onUpdateDraft,
  onClearDraft,
  onRevertDraft,
  onApplyDraft,
  sortSelectOptions,
  addedBySelectOptions,
  priceMinSelectorValue,
  priceMaxSelectorValue,
  applyLabel,
  matchingSummary,
  showSuggestionsOnlyFilter,
  suggestionsOnly,
}) => {
  const footer = (
    <div
      className = {
        styles['list-filters__footer']
      }
    >
      <p
        className = {
          styles['list-filters__footer-meta']
        }
      >
        {matchingSummary}
      </p>
      <div
        className = {
          styles['list-filters__footer-actions']
        }
      >
        <Button
          type = {
            'button'
          }
          variant = {
            'ghost'
          }
          onClick = {
            onClearDraft
          }
        >
          Reset
        </Button>
        <Button
          type = {
            'button'
          }
          variant = {
            'ghost'
          }
          onClick = {
            () => {
              onRevertDraft();
              onClose();
            }
          }
        >
          Cancel
        </Button>
        <Button
          type = {
            'button'
          }
          variant = {
            'primary'
          }
          onClick = {
            onApplyDraft
          }
        >
          {applyLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer
      isOpen = {
        isDrawerOpen
      }
      position = {
        'right'
      }
      title = {
        'Sort & filter'
      }
      onClose = {
        onClose
      }
      mobilePresentation = {
        'sheet'
      }
      footer = {
        footer
      }
      headerExtra = {
        hasUnsavedDraft ? (
          <span
            className = {
              styles['list-filters__unsaved']
            }
          >
            Unsaved changes
          </span>
        ) : null
      }
    >
      <div
        className = {
          styles['list-filters']
        }
      >
        <div
          className = {
            styles['list-filters__body']
          }
        >
          <section
            className = {
              styles['list-filters__section']
            }
          >
            <h4
              className = {
                styles['list-filters__section-title']
              }
            >
              Sorting
            </h4>
            <SelectMenu
              className = {
                styles['list-filters__select-menu']
              }
              value = {
                draft.sort
              }
              options = {
                sortSelectOptions
              }
              onChange = {
                (value) => {
                  onUpdateDraft((prev) => ({
                    ...prev,
                    sort: value as typeof prev.sort,
                  }));
                }
              }
              variant = {
                'field'
              }
              menuTitle = {
                'Sort by'
              }
              aria-label = {
                'Sort by'
              }
            />
          </section>

          {capabilities.showAvailabilityFilter ? (
            <>
              <SectionDivider />
              <section
              className = {
                styles['list-filters__section']
              }
            >
              <h4
                className = {
                  styles['list-filters__section-title']
                }
              >
                Availability
              </h4>
              <FilterChipGroup
                ariaLabel = {
                  'Availability'
                }
                options = {
                  [
                    { id: 'all', label: 'All' },
                    { id: 'available', label: 'Open' },
                    { id: 'claimed', label: 'Claimed' },
                  ]
                }
                value = {
                  draft.filters.availability
                }
                onChange = {
                  (id) => {
                    onUpdateDraft((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, availability: id },
                    }));
                  }
                }
              />
            </section>
            </>
          ) : null}

          {showSuggestionsOnlyFilter ? (
            <>
              {!capabilities.showAvailabilityFilter ? <SectionDivider /> : null}
              <section
                className = {
                  styles['list-filters__section']
                }
              >
            <FilterSwitchRow
              id = {
                'list-filter-suggestions-only'
              }
              label = {
                'Suggestions only'
              }
              checked = {
                suggestionsOnly
              }
              onChange = {
                (checked) => {
                  onUpdateDraft((prev) => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      itemType: checked ? 'suggestion' : 'all',
                    },
                  }));
                }
              }
            />
              </section>
            </>
          ) : null}

          <SectionDivider />

          <section
            className = {
              styles['list-filters__section']
            }
          >
            <h4
              className = {
                styles['list-filters__section-title']
              }
            >
              Categories
            </h4>
            <p
              className = {
                styles['list-filters__hint']
              }
            >
              Select one or more categories to narrow results.
            </p>
            <div
              className = {
                categoryFieldStyles['categories__chip-group']
              }
            >
              {categoryOptions.map((option) => {
                const isSelected = draft.filters.categories.includes(option.key);
                return (
                  <Chip
                    key = {
                      option.key
                    }
                    label = {
                      option.label
                    }
                    isActive = {
                      isSelected
                    }
                    onClick = {
                      () => {
                        onUpdateDraft((prev) => {
                          const categories = isSelected
                            ? prev.filters.categories.filter((key) => key !== option.key)
                            : [...prev.filters.categories, option.key];
                          return {
                            ...prev,
                            filters: { ...prev.filters, categories },
                          };
                        });
                      }
                    }
                  />
                );
              })}
            </div>
          </section>

          <SectionDivider />

          <section
            className = {
              styles['list-filters__section']
            }
          >
            <h4
              className = {
                styles['list-filters__section-title']
              }
            >
              Price range
            </h4>
            <div
              className = {
                styles['list-filters__price-range']
              }
            >
              <div
                className = {
                  styles['list-filters__price-bound']
                }
              >
                <span
                  className = {
                    styles['list-filters__price-bound-label']
                  }
                >
                  Min
                </span>
                <NumberSelector
                  className = {
                    styles['list-filters__price-selector']
                  }
                  value = {
                    priceMinSelectorValue
                  }
                  min = {
                    LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR
                  }
                  dashValue = {
                    LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR
                  }
                  onChange = {
                    (next) => {
                      onUpdateDraft((prev) => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          priceMin: listPriceMinSelectorValueToString(next),
                        },
                      }));
                    }
                  }
                  decreaseLabel = {
                    'Decrease minimum price'
                  }
                  increaseLabel = {
                    'Increase minimum price'
                  }
                  editLabel = {
                    'Edit minimum price'
                  }
                  size = {
                    'sm'
                  }
                />
              </div>
              <ArrowRight
                aria-hidden = {
                  true
                }
                className = {
                  styles['list-filters__price-range-arrow']
                }
              />
              <div
                className = {
                  styles['list-filters__price-bound']
                }
              >
                <span
                  className = {
                    styles['list-filters__price-bound-label']
                  }
                >
                  Max
                </span>
                <NumberSelector
                  className = {
                    styles['list-filters__price-selector']
                  }
                  value = {
                    priceMaxSelectorValue
                  }
                  min = {
                    LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR
                  }
                  infinityValue = {
                    LIST_DISPLAY_PRICE_RANGE_BOUND_UNSET_SELECTOR
                  }
                  onChange = {
                    (next) => {
                      const resolved = resolveListPriceMaxSelectorChange(next, priceMinSelectorValue);
                      onUpdateDraft((prev) => ({
                        ...prev,
                        filters: {
                          ...prev.filters,
                          priceMax: listPriceMaxSelectorValueToString(resolved),
                        },
                      }));
                    }
                  }
                  decreaseLabel = {
                    'Decrease maximum price'
                  }
                  increaseLabel = {
                    'Increase maximum price'
                  }
                  editLabel = {
                    'Edit maximum price'
                  }
                  size = {
                    'sm'
                  }
                />
              </div>
            </div>
            <FilterSwitchRow
              id = {
                'list-filter-include-no-price'
              }
              label = {
                'Include items with no price'
              }
              checked = {
                draft.filters.includeNoPriceInRange
              }
              onChange = {
                (checked) => {
                  onUpdateDraft((prev) => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      includeNoPriceInRange: checked,
                    },
                  }));
                }
              }
            />
          </section>

          {capabilities.showAddedBy ? (
            <>
              <SectionDivider />
              <section
              className = {
                styles['list-filters__section']
              }
            >
              <h4
                className = {
                  styles['list-filters__section-title']
                }
              >
                Added by
              </h4>
              <SelectMenu
                className = {
                  styles['list-filters__select-menu']
                }
                value = {
                  draft.filters.addedByUserId
                }
                options = {
                  addedBySelectOptions
                }
                onChange = {
                  (value) => {
                    onUpdateDraft((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, addedByUserId: value },
                    }));
                  }
                }
                variant = {
                  'field'
                }
                menuTitle = {
                  'Added by'
                }
                aria-label = {
                  'Added by'
                }
              />
            </section>
            </>
          ) : null}

          {capabilities.showGroupFunding ? (
            <>
              <SectionDivider />
              <section
              className = {
                styles['list-filters__section']
              }
            >
              <h4
                className = {
                  styles['list-filters__section-title']
                }
              >
                Group funding
              </h4>
              <SelectMenu
                className = {
                  styles['list-filters__select-menu']
                }
                value = {
                  draft.filters.funding
                }
                options = {
                  LIST_FUNDING_FILTER_OPTIONS
                }
                onChange = {
                  (value) => {
                    onUpdateDraft((prev) => ({
                      ...prev,
                      filters: {
                        ...prev.filters,
                        funding: value as typeof prev.filters.funding,
                      },
                    }));
                  }
                }
                variant = {
                  'field'
                }
                menuTitle = {
                  LIST_FUNDING_FILTER_MENU_TITLE
                }
                aria-label = {
                  'Group funding'
                }
              />
            </section>
            </>
          ) : null}

          <SectionDivider />

          <section
            className = {
              styles['list-filters__section']
            }
          >
            <h4
              className = {
                styles['list-filters__section-title']
              }
            >
              Attributes
            </h4>
            {capabilities.showFavorites ? (
              <FilterSwitchRow
                id = {
                  'list-filter-favorites-only'
                }
                label = {
                  'Favorites only'
                }
                checked = {
                  draft.filters.favoritesOnly
                }
                onChange = {
                  (checked) => {
                    onUpdateDraft((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, favoritesOnly: checked },
                    }));
                  }
                }
              />
            ) : null}
            {capabilities.showPriorityOnly ? (
              <FilterSwitchRow
                id = {
                  'list-filter-priority-only'
                }
                label = {
                  'Priority items only'
                }
                checked = {
                  draft.filters.priorityOnly
                }
                onChange = {
                  (checked) => {
                    onUpdateDraft((prev) => ({
                      ...prev,
                      filters: { ...prev.filters, priorityOnly: checked },
                    }));
                  }
                }
              />
            ) : null}
            {capabilities.showPartialQuantity ? (
              <FilterSwitchRow
                id = {
                  'list-filter-partial-qty'
                }
                label = {
                  'Partial quantity remaining'
                }
                checked = {
                  draft.filters.partialQuantityRemaining
                }
                onChange = {
                  (checked) => {
                    onUpdateDraft((prev) => ({
                      ...prev,
                      filters: {
                        ...prev.filters,
                        partialQuantityRemaining: checked,
                      },
                    }));
                  }
                }
              />
            ) : null}
          </section>

          {capabilities.showEnrichFilters ? (
            <>
              <SectionDivider />
              <section
                className = {
                  styles['list-filters__section']
                }
              >
                <h4
                  className = {
                    styles['list-filters__section-title']
                  }
                >
                  Link?
                </h4>
                <FilterChipGroup
                  ariaLabel = {
                    'Link?'
                  }
                  options = {
                    [
                      { id: 'all', label: 'Any' },
                      { id: 'yes', label: 'Yes' },
                      { id: 'no', label: 'No' },
                    ]
                  }
                  value = {
                    draft.filters.hasLink
                  }
                  onChange = {
                    (id) => {
                      onUpdateDraft((prev) => ({
                        ...prev,
                        filters: { ...prev.filters, hasLink: id },
                      }));
                    }
                  }
                />
              </section>
              <SectionDivider />
              <section
                className = {
                  styles['list-filters__section']
                }
              >
                <h4
                  className = {
                    styles['list-filters__section-title']
                  }
                >
                  Photo?
                </h4>
                <FilterChipGroup
                  ariaLabel = {
                    'Photo?'
                  }
                  options = {
                    [
                      { id: 'all', label: 'Any' },
                      { id: 'yes', label: 'Yes' },
                      { id: 'no', label: 'No' },
                    ]
                  }
                  value = {
                    draft.filters.hasPhoto
                  }
                  onChange = {
                    (id) => {
                      onUpdateDraft((prev) => ({
                        ...prev,
                        filters: { ...prev.filters, hasPhoto: id },
                      }));
                    }
                  }
                />
              </section>
            </>
          ) : null}
        </div>
      </div>
    </Drawer>
  );
};
