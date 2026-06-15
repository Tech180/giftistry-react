import React from 'react';
import { Tag, FileText } from 'lucide-react';
import { Input, Button } from 'shared/ui';
import { AddItemFormTemplateProps } from '../../interfaces/add-item-form-template-props.interface';
import styles from './add-item-form.module.css';

export const AddItemFormTemplate: React.FC<AddItemFormTemplateProps> = ({
  name,
  setName,
  description,
  setDescription,
  priorityId,
  setPriorityId,
  isHiddenIdea,
  setIsHiddenIdea,
  priorities,
  isOwner,
  isLoading,
  errorMsg,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`}>
          <span>{errorMsg}</span>
        </div>
      )}

      <Input
        label="Item Name *"
        type="text"
        placeholder="e.g. Mechanical Keyboard"
        value={name}
        onChange={(e) => setName(e.target.value)}
        leftIcon={<Tag size={16} />}
        required
      />

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description (Optional)</label>
        <div className={styles.textareaWrapper}>
          <span className={styles.textareaIcon}><FileText size={16} /></span>
          <textarea
            placeholder="Add details, size, color, or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            rows={3}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Priority Level (Optional)</label>
        <select
          value={priorityId}
          onChange={(e) => setPriorityId(e.target.value)}
          className={styles.select}
        >
          <option value="">No priority level</option>
          {priorities.map((p) => (
            <option key={p.Id} value={p.Id}>
              {p.Label} (Weight: {p.Weight})
            </option>
          ))}
        </select>
      </div>

      {!isOwner && (
        <div className={styles.checkboxWrapper}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isHiddenIdea}
              onChange={(e) => setIsHiddenIdea(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              <strong>Suggest as Surprise Idea</strong>
              <span className={styles.checkboxSubtext}>
                This item will be hidden from the owner's view until their wishlist expires.
              </span>
            </span>
          </label>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className={styles.submitBtn}
      >
        Add Item
      </Button>
    </form>
  );
};
