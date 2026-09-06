import React, { useState } from 'react';
import { ChevronDown, Bot, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { Input, Switch } from 'shared/ui';
import { CreateListFormTemplateProps } from '../../interfaces/create-list-form-template-props.interface';
import styles from './create-list-form.module.css';

export const CreateListFormTemplate: React.FC<CreateListFormTemplateProps> = ({
  title,
  setTitle,
  expiresAt,
  setExpiresAt,
  allowGroupFunds,
  setAllowGroupFunds,
  isLoading,
  errorMsg,
  handleSubmit,
  category,
  setCategory,
  customCategory,
  setCustomCategory,
  aiEnabled,
  setAiEnabled,
  webSearchEnabled,
  setWebSearchEnabled,
  autoRollover,
  setAutoRollover,
  globalAiEnabled,
  globalWebSearchEnabled,
  onCancel,
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`}>
          <Loader2 size={16} style={{ display: 'none' }} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className={styles['form-scroll-content']}>
        {/* Title Input */}
        <Input
          label="Wishlist Title *"
          type="text"
          placeholder="e.g., Birthday 2026, Office Secret Santa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles['input-group']}
          required
        />

        <div className={styles['category-section']}>
          {/* Category & Expiration Row */}
          <div className={styles['row-split']}>
            {/* Category */}
            <div className={styles['flex-3']}>
              <label className={styles.label}>Category</label>
              <div className={styles['select-wrapper']}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="generic">General</option>
                  <option value="birthday">Birthday</option>
                  <option value="holiday">Holiday</option>
                  <option value="wedding">Wedding</option>
                  <option value="custom">Custom...</option>
                </select>
                <span className={styles['select-icon']}>
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>

            {/* Date */}
            <div className={styles['flex-2']}>
              <Input
                label="Date (Optional)"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={styles['input-group']}
              />
            </div>
          </div>

          {/* Custom Category Input (always in DOM, animated via styles['grid-collapse']) */}
          <div className={`${styles['grid-collapse']} ${category === 'custom' ? styles['is-open'] : ''}`}>
            <div>
              <Input
                label="Custom Category Name *"
                type="text"
                placeholder="e.g., Baby Shower"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className={styles['input-group']}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles['advanced-section']}>
          <button
            type="button"
            className={styles['advanced-trigger']}
            onClick={() => setAdvancedOpen((open) => !open)}
            aria-expanded={advancedOpen}
            aria-controls="create-list-advanced-options"
          >
            <span className={styles['advanced-title']}>Advanced Options</span>
            <span
              className={`${styles['advanced-chevron']} ${advancedOpen ? styles['advanced-chevron-open'] : ''}`}
            >
              <ChevronDown size={16} />
            </span>
          </button>

          <div
            id="create-list-advanced-options"
            className={`${styles['grid-collapse']} ${advancedOpen ? styles['is-open'] : ''}`}
            aria-hidden={!advancedOpen}
          >
            {advancedOpen ? (
            <div>
              <div className={styles['advanced-options']}>
          {/* Group Funding Toggle */}
          <div className={styles['toggle-wrapper']}>
            <div className={styles['toggle-text-block']}>
              <div className={styles['toggle-title']}>Group Funding</div>
              <div className={styles['toggle-description']}>Allow friends to pool money together for expensive items on this list.</div>
            </div>
            <Switch
              checked={allowGroupFunds}
              onChange={setAllowGroupFunds}
              aria-label="Group Funding"
            />
          </div>

          {/* Auto Rollover Toggle */}
          <div className={styles['toggle-wrapper']}>
            <div className={styles['toggle-text-block']}>
              <div className={styles['toggle-title']}>Auto Rollover</div>
              <div className={styles['toggle-description']}>
                When this list expires, carry unclaimed items and marked comments into a new list.
              </div>
            </div>
            <Switch
              checked={autoRollover}
              onChange={setAutoRollover}
              aria-label="Auto Rollover"
            />
          </div>

          {/* AI Features Toggle Card */}
          {globalAiEnabled && (
            <div className={styles['ai-section-card']}>
              <div className={styles['toggle-wrapper']}>
                <div className={styles['toggle-text-block']}>
                  <div className={`${styles['toggle-title']} ${styles['ai-title']}`}>
                    <Bot size={16} className={styles['ai-icon']} />
                    Enable AI Features
                  </div>
                  <div className={styles['toggle-description']}>Automatically generate summaries and extract product details from URLs.</div>
                </div>
                <Switch
                  checked={aiEnabled}
                  onChange={setAiEnabled}
                  aria-label="Enable AI Features"
                />
              </div>

              {/* Nested Web Search Toggle */}
              {globalWebSearchEnabled && (
                <div className={`${styles['grid-collapse']} ${aiEnabled ? styles['is-open'] : ''}`}>
                  <div className={styles['nested-toggle-container']}>
                    <div className={`${styles['toggle-wrapper']} ${styles['nested-toggle']} ${!aiEnabled ? styles.disabled : ''}`}>
                      <div className={styles['nested-title-block']}>
                        <Globe size={14} className={styles['globe-icon']} />
                        <span className={styles['nested-text']}>Allow live web search</span>
                      </div>
                      <Switch
                        checked={webSearchEnabled}
                        onChange={setWebSearchEnabled}
                        disabled={!aiEnabled}
                        size="sm"
                        aria-label="Allow live web search"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

              </div>
            </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Sticky footer buttons */}
      <div className={styles.footer}>
        <button
          type="button"
          onClick={onCancel}
          className={styles['cancel-btn']}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`${styles['submit-btn']} ${isLoading ? styles.loading : ''}`}
        >
          {isLoading ? (
            <span className={styles['spinner-wrapper']}>
              <Loader2 size={16} className={styles.spinner} />
              Saving...
            </span>
          ) : (
            <span className={styles['btn-text']}>
              Create Wishlist
              <ArrowRight size={14} className={styles['arrow-icon']} />
            </span>
          )}
        </button>
      </div>

    </form>
  );
};
