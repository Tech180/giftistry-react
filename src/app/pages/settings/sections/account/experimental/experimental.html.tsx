import React from 'react';
import { EnterPanel, Switch } from 'shared/ui';
import { Tutorial } from '../account/components/tutorial/tutorial.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './experimental.module.css';

export const ExperimentalTemplate: React.FC<TemplateProps> = ({
  definitions,
  isEnabled,
  isSaving,
  productTutorialEnabled,
  onToggle,
}) => (
  <EnterPanel
    animation = {
      'fade'
    }
    className = {
      styles['experimental']
    }
  >
    <div
      className = {
        styles['experimental__header']
      }
    >
      <h2
        className = {
          styles['experimental__title']
        }
      >
        Experimental
      </h2>
      <p
        className = {
          styles['experimental__subtitle']
        }
      >
        Opt into unfinished or preview features. Changes apply to your account only.
      </p>
    </div>

    <div
      className = {
        styles['experimental__card']
      }
    >
      {
        definitions.map((feature, index) => (
          <React.Fragment
            key = {
              feature.id
            }
          >
            {
              index > 0 ? (
                <div
                  className = {
                    styles['experimental__divider']
                  }
                />
              ) : null
            }
            <div
              className = {
                styles['experimental__row']
              }
            >
              <div>
                <div
                  className = {
                    styles['experimental__row-title']
                  }
                >
                  {
                    feature.title
                  }
                </div>
                <div
                  className = {
                    styles['experimental__row-desc']
                  }
                >
                  {
                    feature.description
                  }
                </div>
              </div>
              <Switch
                checked = {
                  isEnabled(feature.id)
                }
                onChange = {
                  (checked) => {
                    onToggle(feature.id, checked);
                  }
                }
                disabled = {
                  isSaving
                }
                aria-label = {
                  feature.title
                }
              />
            </div>
          </React.Fragment>
        ))
      }
    </div>

    {
      productTutorialEnabled ? <Tutorial /> : null
    }
  </EnterPanel>
);
