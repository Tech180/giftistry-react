import React from 'react';
import { Plus, Wand2, Pencil, X, Info, AlertTriangle, LoaderCircle } from 'lucide-react';
import { TOUR_TARGETS } from 'features/tour';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './add-widget.module.css';

export const AddWidgetTemplate: React.FC<TemplateProps> = ({
  isInputMode,
  isMenuOpen,
  isExpanded,
  canAutoAdd,
  url,
  errorMsg,
  isSubmitting,
  hintText,
  menuToggleLabel,
  actionTabIndex,
  rootClassName,
  barClassName,
  urlInputRef,
  widgetRef,
  onUrlChange,
  onIconTriggerClick,
  onAutoClick,
  onManualClick,
  onExitInputMode,
  onSubmit,
}) => (
  <div
    ref = {
      widgetRef
    }
    className = {
      rootClassName
    }
    data-add-widget
    data-input-mode = {
      isInputMode ? 'true' : 'false'
    }
    data-auto-add = {
      canAutoAdd ? 'true' : 'false'
    }
    data-menu-open = {
      isMenuOpen ? 'true' : 'false'
    }
    tabIndex = {
      isInputMode ? -1 : 0
    }
    aria-label = {
      'Add item options'
    }
  >
    <div
      className = {
        barClassName
      }
      data-tour = {
        TOUR_TARGETS.addManually
      }
    >
      <div
        className = {
          `${styles['add-widget__menu-layer']}${isInputMode ? ` ${styles['add-widget__menu-layer--hidden']}` : ''}`
        }
        aria-hidden = {
          isInputMode
        }
      >
        <button
          type = {
            'button'
          }
          className = {
            `${styles['add-widget__icon-trigger']}${isExpanded ? ` ${styles['add-widget__icon-trigger--expanded']}` : ''}`
          }
          aria-label = {
            menuToggleLabel
          }
          aria-expanded = {
            isMenuOpen
          }
          aria-haspopup = {
            'true'
          }
          onClick = {
            onIconTriggerClick
          }
        >
          <Plus
            size = {
              18
            }
            aria-hidden = {
              'true'
            }
          />
        </button>
        <div
          className = {
            `${styles['add-widget__actions']}${isExpanded ? ` ${styles['add-widget__actions--visible']}` : ''}`
          }
        >
          {canAutoAdd ? (
            <button
              type = {
                'button'
              }
              className = {
                styles['add-widget__action-btn']
              }
              aria-label = {
                'Auto'
              }
              tabIndex = {
                actionTabIndex
              }
              data-tour = {
                TOUR_TARGETS.autoAdd
              }
              onClick = {
                onAutoClick
              }
            >
              <Wand2
                size = {
                  14
                }
                aria-hidden = {
                  'true'
                }
              />
              <span
                className = {
                  `${styles['add-widget__action-text']}${isExpanded ? ` ${styles['add-widget__action-text--visible']}` : ''}`
                }
              >
                Auto
              </span>
            </button>
          ) : null}
          <button
            type = {
              'button'
            }
            className = {
              styles['add-widget__action-btn']
            }
            aria-label = {
              'Manual'
            }
            tabIndex = {
              actionTabIndex
            }
            onClick = {
              onManualClick
            }
          >
            <Pencil
              size = {
                14
              }
              aria-hidden = {
                'true'
              }
            />
            <span
              className = {
                `${styles['add-widget__action-text']}${isExpanded ? ` ${styles['add-widget__action-text--visible']}` : ''}`
              }
            >
              Manual
            </span>
          </button>
        </div>
      </div>

      {canAutoAdd ? (
        <form
          className = {
            `${styles['add-widget__form-layer']}${isInputMode ? ` ${styles['add-widget__form-layer--visible']}` : ''}`
          }
          onSubmit = {
            onSubmit
          }
          aria-label = {
            'Auto add item from link'
          }
          noValidate
        >
          <input
            ref = {
              urlInputRef
            }
            type = {
              'url'
            }
            className = {
              styles['add-widget__url-input']
            }
            placeholder = {
              'Paste product URL...'
            }
            value = {
              url
            }
            onChange = {
              (event) => onUrlChange(event.target.value)
            }
            disabled = {
              isSubmitting
            }
            autoComplete = {
              'off'
            }
          />
          <button
            type = {
              'submit'
            }
            className = {
              `${styles['add-widget__form-btn']} ${styles['add-widget__submit-btn']}`
            }
            disabled = {
              isSubmitting || !url.trim()
            }
            title = {
              'Auto-add from link'
            }
            aria-label = {
              'Auto-add from link'
            }
          >
            {isSubmitting ? (
              <LoaderCircle
                size = {
                  14
                }
                className = {
                  styles['add-widget__spin-icon']
                }
                aria-hidden = {
                  'true'
                }
              />
            ) : (
              <Wand2
                size = {
                  14
                }
                aria-hidden = {
                  'true'
                }
              />
            )}
          </button>
          <button
            type = {
              'button'
            }
            className = {
              `${styles['add-widget__form-btn']} ${styles['add-widget__cancel-btn']}`
            }
            onClick = {
              onExitInputMode
            }
            disabled = {
              isSubmitting
            }
            title = {
              'Close auto add'
            }
            aria-label = {
              'Close auto add'
            }
          >
            <X
              size = {
                14
              }
              aria-hidden = {
                'true'
              }
            />
          </button>
        </form>
      ) : null}
    </div>

    <div
      className = {
        `${styles['add-widget__popover']}${isInputMode ? ` ${styles['add-widget__popover--visible']}` : ''}`
      }
      aria-live = {
        'polite'
      }
    >
      {errorMsg ? (
        <p
          className = {
            `${styles['add-widget__popover-text']} ${styles['add-widget__popover-text--error']}`
          }
          role = {
            'alert'
          }
        >
          <AlertTriangle
            size = {
              14
            }
            className = {
              styles['add-widget__popover-icon']
            }
            aria-hidden = {
              'true'
            }
          />
          <span>{errorMsg}</span>
        </p>
      ) : (
        <p
          className = {
            styles['add-widget__popover-text']
          }
        >
          <Info
            size = {
              14
            }
            className = {
              styles['add-widget__popover-icon']
            }
            aria-hidden = {
              'true'
            }
          />
          <span>{hintText}</span>
        </p>
      )}
    </div>
  </div>
);
