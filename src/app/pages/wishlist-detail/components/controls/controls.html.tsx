import React from 'react';
import { TOUR_TARGETS } from 'features/tour';
import styles from './controls.module.css';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ControlsTemplate: React.FC<TemplateProps> = ({
  viewModeOptions,
  activeViewIcon: ActiveViewIcon,
  activeViewLabel,
  searchQuery,
  onSearchQueryChange,
  onSelectViewMode,
  isViewModeMenuOpen,
  onViewModeMenuOpenChange,
  addItemWidget,
}) => {
  return (
    <div
      className = {
        styles.controls
      }
    >
      <h3
        className = {
          styles['controls__title']
        }
      >
        Gift Ideas
      </h3>
      <div
        className = {
          styles['controls__actions']
        }
      >
        <label
          className = {
            styles['controls__search']
          }
        >
          <span
            className = {
              styles['controls__search-icon']
            }
            aria-hidden
          >
            <svg
              width = {
                '18'
              }
              height = {
                '18'
              }
              viewBox = {
                '0 0 24 24'
              }
              fill = {
                'none'
              }
              stroke = {
                'currentColor'
              }
              strokeWidth = {
                '2'
              }
              strokeLinecap = {
                'round'
              }
            >
              <circle
                cx = {
                  '11'
                }
                cy = {
                  '11'
                }
                r = {
                  '8'
                }
              />
              <path
                d = {
                  'm21 21-4.3-4.3'
                }
              />
            </svg>
          </span>
          <input
            type = {
              'text'
            }
            placeholder = {
              'Search ideas...'
            }
            value = {
              searchQuery
            }
            onChange = {
              (e) => onSearchQueryChange(e.target.value)
            }
            className = {
              styles['controls__search-input']
            }
            aria-label = {
              'Search ideas'
            }
          />
        </label>

        <div
          className = {
            styles['controls__view-switcher']
          }
          role = {
            'tablist'
          }
          aria-label = {
            'Item view mode'
          }
          data-tour = {
            TOUR_TARGETS.viewMode
          }
        >
          {viewModeOptions.map(({ mode, Icon, label, isActive }) => (
            <button
              key = {
                mode
              }
              type = {
                'button'
              }
              role = {
                'tab'
              }
              aria-selected = {
                isActive
              }
              className = {
                `${styles['controls__view-btn']} ${isActive ? styles['controls__view-btn--active'] : ''}`
              }
              onClick = {
                () => onSelectViewMode(mode)
              }
              title = {
                `${label} View`
              }
              aria-label = {
                `${label} View`
              }
            >
              <Icon
                size = {
                  16
                }
              />
            </button>
          ))}
        </div>

        <details
          className = {
            styles['controls__view-mode-menu']
          }
          data-tour = {
            TOUR_TARGETS.viewMode
          }
          onToggle = {
            (event) => onViewModeMenuOpenChange(event.currentTarget.open)
          }
        >
          <summary
            className = {
              `${styles['controls__view-mode-trigger']}${isViewModeMenuOpen ? ` ${styles['controls__view-mode-trigger--open']}` : ''}`
            }
            aria-label = {
              `View options, current: ${activeViewLabel}`
            }
          >
            <ActiveViewIcon
              size = {
                18
              }
              aria-hidden
            />
          </summary>
          <div
            className = {
              styles['controls__view-mode-panel']
            }
            role = {
              'menu'
            }
            aria-label = {
              'Item view mode'
            }
          >
            {viewModeOptions.map(({ mode, Icon, label, isActive }) => (
              <button
                key = {
                  mode
                }
                type = {
                  'button'
                }
                role = {
                  'menuitemradio'
                }
                aria-checked = {
                  isActive
                }
                className = {
                  `${styles['controls__view-mode-option']} ${isActive ? styles['controls__view-mode-option--active'] : ''}`
                }
                onClick = {
                  (e) => onSelectViewMode(mode, e)
                }
              >
                <span
                  className = {
                    styles['controls__view-mode-option-icon']
                  }
                >
                  <Icon
                    size = {
                      16
                    }
                    aria-hidden
                  />
                </span>
                <span>{label} View</span>
              </button>
            ))}
          </div>
        </details>

        {addItemWidget}
      </div>
    </div>
  );
};
