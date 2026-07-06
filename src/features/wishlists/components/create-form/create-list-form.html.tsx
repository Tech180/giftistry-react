import React from 'react';
import { Calendar, Tag, AlertCircle, ChevronDown } from 'lucide-react';
import { Input, Button } from 'shared/ui';
import { CreateListFormTemplateProps } from '../../interfaces/create-list-form-template-props.interface';
import styles from './create-list-form.module.css';

export const CreateListFormTemplate: React.FC<CreateListFormTemplateProps> = ({
  title,
  setTitle,
  expiresAt,
  setExpiresAt,
  allowGroupFunds,
  setAllowGroupFunds,
  revealSuggestions,
  setRevealSuggestions,
  isLoading,
  errorMsg,
  handleSubmit,
  category,
  setCategory,
  customCategory,
  setCustomCategory,
  aiEnabled,
  setAiEnabled,
  globalAiEnabled,
  isUnverified = false,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      <Input
        label="Wishlist Title *"
        type="text"
        placeholder="Birthday Wishlist 2026"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        leftIcon={<Tag size={16} />}
        required
      />

      <div className={styles['form-group']}>
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
          <ChevronDown size={16} className={styles['select-icon']} />
        </div>
      </div>

      {category === 'custom' && (
        <Input
          label="Custom Category Name *"
          type="text"
          placeholder="Housewarming, Graduation"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          leftIcon={<Tag size={16} />}
          required
        />
      )}

      <Input
        label="Expiration Date (Optional)"
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        leftIcon={<Calendar size={16} />}
      />

      <div className={styles['checkbox-wrapper']}>
        <label className={styles['checkbox-label']}>
          <input
            type="checkbox"
            checked={allowGroupFunds}
            onChange={(e) => setAllowGroupFunds(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles['checkbox-text']}>
            <strong>Enable Group Funding</strong>
            <span className={styles['checkbox-subtext']}>
              Allows friends to pool money together to claim high-ticket items.
            </span>
          </span>
        </label>
      </div>

      <div className={styles['checkbox-wrapper']}>
        <label className={styles['checkbox-label']}>
          <input
            type="checkbox"
            checked={revealSuggestions}
            onChange={(e) => setRevealSuggestions(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles['checkbox-text']}>
            <strong>Reveal Suggestions After Expiration</strong>
            <span className={styles['checkbox-subtext']}>
              Collaborators can suggest gifts anonymously. Reveal who suggested what after the list expires.
            </span>
          </span>
        </label>
      </div>

      {globalAiEnabled && (
        <div className={styles['checkbox-wrapper']}>
          <label className={styles['checkbox-label']}>
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles['checkbox-text']}>
              <strong>Enable AI Reviews on Items</strong>
              <span className={styles['checkbox-subtext']}>
                Automatically generates product summaries, pros and cons, and compiles representative reviews.
              </span>
            </span>
          </label>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={isUnverified}
        className={styles['submit-btn']}
      >
        Create Wishlist
      </Button>
    </form>
  );
};
