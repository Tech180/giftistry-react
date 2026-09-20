import React from 'react';
import { Button, NumberSelector } from 'shared/ui';
import { Tags } from 'features/comments';
import { ClaimAnonymousToggle } from '../claim-anonymous-toggle/claim-anonymous-toggle.component';
import { ClaimPrompt } from '../claim-prompt/claim-prompt.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './claim-form.module.css';

export const ClaimFormTemplate: React.FC<TemplateProps> = ({
  prompt,
  title,
  confirmLabel,
  anonymous,
  onAnonymousChange,
  formClassName,
  drawerActionsClassName,
  actionGroupClassName,
  drawerActionBtnClassName,
  showQuantityUi,
  showVariationList,
  quantityRows,
  inlineRow,
  totalRemaining,
  confirmDisabled,
  confirmLoading,
  onQuantityChange,
  onFormSubmit,
  onFormClick,
  onCancel,
  showLinkedTags,
  taggedIds,
  wishlistItems,
  onLinkedItemClick,
  showGroupFunding,
  groupFundingStarted,
  groupFundingEnabled,
  onGroupFundingEnabledChange,
  claimAmount,
  onClaimAmountChange,
  remainingAmount,
  amountInputId,
  inlineDecreaseLabel,
  inlineIncreaseLabel,
}) => {
  return (
    <form
      className={formClassName}
      onSubmit={onFormSubmit}
      onClick={onFormClick}
    >
      {showQuantityUi ? (
        <>
          <div className={styles['claim-form__drawer-header']}>
            <div className={styles['claim-form__header-count']}>
              <div className={styles['claim-form__drawer-total']} title="Amount left">
                {totalRemaining}
              </div>
              {inlineRow ? (
                <NumberSelector
                  value = {
                    inlineRow.quantity
                  }
                  min = {
                    0
                  }
                  max = {
                    inlineRow.maxForUser
                  }
                  onChange = {
                    (next) => onQuantityChange(inlineRow.selection, next)
                  }
                  decreaseLabel = {
                    inlineDecreaseLabel
                  }
                  increaseLabel = {
                    inlineIncreaseLabel
                  }
                  disabled = {
                    inlineRow.selectorDisabled
                  }
                />
              ) : null}
            </div>
            <h4 className={styles['claim-form__drawer-title']}>{title}</h4>
          </div>
          {showVariationList ? (
            <div className={styles['claim-form__qty-list']}>
              {quantityRows.map((row) => (
                <div key={row.inputId} className={row.rowClassName}>
                  <div className={styles['claim-form__qty-info']}>
                    <span className={row.hintClassName} aria-label={`${row.remaining} remaining`}>
                      {row.remaining}
                    </span>
                    <span className={styles['claim-form__qty-label']} id={row.inputId}>
                      {row.name}
                    </span>
                  </div>
                  <NumberSelector
                    value = {
                      row.quantity
                    }
                    min = {
                      0
                    }
                    max = {
                      row.maxForUser
                    }
                    onChange = {
                      (next) => onQuantityChange(row.selection, next)
                    }
                    decreaseLabel = {
                      row.decreaseLabel
                    }
                    increaseLabel = {
                      row.increaseLabel
                    }
                    disabled = {
                      row.selectorDisabled
                    }
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className={drawerActionsClassName}>
            <ClaimAnonymousToggle
              checked = {
                anonymous
              }
              onChange = {
                onAnonymousChange
              }
            />
            <div className={actionGroupClassName}>
              <Button
                variant = {
                  'ghost'
                }
                size = {
                  'sm'
                }
                type = {
                  'button'
                }
                className = {
                  drawerActionBtnClassName
                }
                onClick = {
                  onCancel
                }
              >
                Cancel
              </Button>
              <Button
                variant = {
                  'primary'
                }
                size = {
                  'sm'
                }
                type = {
                  'submit'
                }
                className = {
                  drawerActionBtnClassName
                }
                isLoading = {
                  confirmLoading
                }
                disabled = {
                  confirmDisabled
                }
              >
                {confirmLabel}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles['claim-form__simple-row']}>
          <ClaimPrompt
            anonymous = {
              anonymous
            }
            onAnonymousChange = {
              onAnonymousChange
            }
            prompt = {
              prompt
            }
            showGroupFunding = {
              showGroupFunding
            }
            groupFundingStarted = {
              groupFundingStarted
            }
            groupFundingEnabled = {
              groupFundingEnabled
            }
            onGroupFundingEnabledChange = {
              onGroupFundingEnabledChange
            }
            claimAmount = {
              claimAmount
            }
            onClaimAmountChange = {
              onClaimAmountChange
            }
            remainingAmount = {
              remainingAmount
            }
            amountInputId = {
              amountInputId
            }
          />
          {showLinkedTags ? (
            <div className={styles['claim-form__linked-tags']}>
              <Tags
                appearance = {
                  'badges'
                }
                taggedIds = {
                  taggedIds
                }
                items = {
                  wishlistItems
                }
                onItemTaggedClick = {
                  onLinkedItemClick
                }
              />
            </div>
          ) : null}
          <div className={styles['claim-form__form-actions']}>
            <Button
              variant = {
                'ghost'
              }
              size = {
                'sm'
              }
              type = {
                'button'
              }
              className = {
                styles['claim-form__form-action']
              }
              onClick = {
                onCancel
              }
            >
              Cancel
            </Button>
            <Button
              variant = {
                'primary'
              }
              size = {
                'sm'
              }
              type = {
                'submit'
              }
              className = {
                styles['claim-form__form-action']
              }
              isLoading = {
                confirmLoading
              }
              disabled = {
                confirmDisabled
              }
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};
