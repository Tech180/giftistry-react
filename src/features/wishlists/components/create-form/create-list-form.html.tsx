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
  isLoading,
  errorMsg,
  handleSubmit,
  category,
  setCategory,
  customCategory,
  setCustomCategory,
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
        placeholder="e.g. Birthday Wishlist 2026"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        leftIcon={<Tag size={16} />}
        required
      />

      <div className={styles.formGroup}>
        <label className={styles.label}>Category</label>
        <div className={styles.selectWrapper}>
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
          <ChevronDown size={16} className={styles.selectIcon} />
        </div>
      </div>

      {category === 'custom' && (
        <Input
          label="Custom Category Name *"
          type="text"
          placeholder="e.g. Housewarming, Graduation"
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

      <div className={styles.checkboxWrapper}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={allowGroupFunds}
            onChange={(e) => setAllowGroupFunds(e.target.checked)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            <strong>Enable Group Funding</strong>
            <span className={styles.checkboxSubtext}>
              Allows friends to pool money together to claim high-ticket items.
            </span>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className={styles.submitBtn}
      >
        Create Wishlist
      </Button>
    </form>
  );
};
