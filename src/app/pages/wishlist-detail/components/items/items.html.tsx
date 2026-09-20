import React from 'react';
import { Plus, ChevronDown, Wand2 } from 'lucide-react';
import { ItemCard, ItemCardSkeleton, CompactCategoryList } from 'features/items';
import { Button, Card } from 'shared/ui';
import {
  ADD_MANUAL_LABEL,
  AUTO_ADD_LABEL,
  CLEAR_SEARCH_LABEL,
  EMPTY_LIST_TEXT,
  SEARCH_EMPTY_PREFIX,
  SEARCH_EMPTY_SUFFIX,
} from './constants/empty-copy.constant';
import type { TemplateProps } from './interfaces/template-props.interface';
import { getGroupChevronClassName } from './utils/get-group-chevron-class-name.util';
import { getGroupClassName } from './utils/get-group-class-name.util';
import { getGroupTitleClassName } from './utils/get-group-title-class-name.util';
import styles from './items.module.css';

export const ItemsTemplate: React.FC<TemplateProps> = ({
  items,
  groupedItems,
  collapsedGroupKeys,
  toggleGroupCollapsed,
  viewMode,
  isLoading,
  searchQuery,
  setSearchQuery,
  canSuggest,
  canAutoAdd,
  openAutoAdd,
  openAddDrawer,
  allowGroupFunds,
  isOwner,
  compactTaggingActive,
  canShowTrailingActions,
  chevronSize,
  groupsClassName,
  buildItemCard,
}) => {
  const renderCard = (item: (typeof items)[number], priorityLabel: string) => {
    const render = buildItemCard(item, priorityLabel);
    if (render.kind === 'skeleton') {
      return (
        <ItemCardSkeleton
          viewMode = {
            render.viewMode
          }
        />
      );
    }

    return <ItemCard {...render.props} />;
  };

  if (isLoading) {
    return (
      <div
        className = {
          styles['items__loading']
        }
      >
        <div
          className = {
            styles['items__spinner']
          }
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card
        className = {
          styles['items__empty']
        }
        padding = {
          'lg'
        }
      >
        <p
          className = {
            styles['items__empty-text']
          }
        >
          {EMPTY_LIST_TEXT}
        </p>
        {canSuggest ? (
          <div
            className = {
              styles['items__empty-actions']
            }
          >
            {canAutoAdd ? (
              <Button
                variant = {
                  'primary'
                }
                size = {
                  'sm'
                }
                leftIcon = {
                  <Wand2 size={14} />
                }
                onClick = {
                  openAutoAdd
                }
              >
                {AUTO_ADD_LABEL}
              </Button>
            ) : null}
            <Button
              variant = {
                'secondary'
              }
              size = {
                'sm'
              }
              leftIcon = {
                <Plus size={14} />
              }
              onClick = {
                openAddDrawer
              }
            >
              {ADD_MANUAL_LABEL}
            </Button>
          </div>
        ) : null}
      </Card>
    );
  }

  if (groupedItems.length === 0) {
    return (
      <Card
        className = {
          styles['items__empty']
        }
        padding = {
          'lg'
        }
      >
        <p
          className = {
            styles['items__empty-text']
          }
        >
          {SEARCH_EMPTY_PREFIX}
          {searchQuery}
          {SEARCH_EMPTY_SUFFIX}
        </p>
        <Button
          variant = {
            'secondary'
          }
          size = {
            'sm'
          }
          onClick = {
            () => setSearchQuery('')
          }
        >
          {CLEAR_SEARCH_LABEL}
        </Button>
      </Card>
    );
  }

  return (
    <div
      className = {
        groupsClassName
      }
    >
      {groupedItems.map((group, groupIndex) => {
        const isCollapsed = collapsedGroupKeys.has(group.categoryKey);

        return (
          <section
            key = {
              group.categoryKey
            }
            className = {
              getGroupClassName(viewMode, isCollapsed)
            }
            aria-labelledby = {
              `group-${group.categoryKey}`
            }
          >
            <button
              type = {
                'button'
              }
              id = {
                `group-${group.categoryKey}`
              }
              className = {
                getGroupTitleClassName(viewMode, isCollapsed, groupIndex === 0)
              }
              aria-expanded = {
                !isCollapsed
              }
              aria-controls = {
                `group-items-${group.categoryKey}`
              }
              onClick = {
                () => toggleGroupCollapsed(group.categoryKey)
              }
            >
              <ChevronDown
                size = {
                  chevronSize
                }
                className = {
                  getGroupChevronClassName(isCollapsed)
                }
                aria-hidden = {
                  'true'
                }
              />
              <span
                className = {
                  styles['items__group-label']
                }
              >
                {group.label}
              </span>
              <span
                className = {
                  styles['items__group-count']
                }
              >
                {group.items.length}
              </span>
            </button>
            {!isCollapsed ? (
              viewMode === 'compact' ? (
                <CompactCategoryList
                  id = {
                    `group-items-${group.categoryKey}`
                  }
                  items = {
                    group.items
                  }
                  allowGroupFunds = {
                    allowGroupFunds
                  }
                  isTaggingModeActive = {
                    compactTaggingActive
                  }
                  isOwner = {
                    isOwner
                  }
                  canShowTrailingActions = {
                    canShowTrailingActions
                  }
                  className = {
                    styles['items__container--compact']
                  }
                >
                  {(item) => (
                    <div
                      key = {
                        item.Id
                      }
                      id = {
                        `item-card-${item.Id}`
                      }
                    >
                      {renderCard(item, group.label)}
                    </div>
                  )}
                </CompactCategoryList>
              ) : (
                <div
                  id = {
                    `group-items-${group.categoryKey}`
                  }
                  className = {
                    styles[`items__container--${viewMode}`]
                  }
                >
                  {group.items.map((item) => (
                    <div
                      key = {
                        item.Id
                      }
                      id = {
                        `item-card-${item.Id}`
                      }
                    >
                      {renderCard(item, group.label)}
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </section>
        );
      })}
    </div>
  );
};
