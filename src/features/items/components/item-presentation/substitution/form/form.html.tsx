import React from 'react';
import { Button, Input } from 'shared/ui';
import type { SubstitutionFormTemplateProps } from './interfaces/substitution-form-template-props.interface';
import { SUBSTITUTION_FORM_ID } from '../../../../constants/substitution-form.constant';
import styles from './form.module.css';

export { SUBSTITUTION_FORM_ID } from '../../../../constants/substitution-form.constant';

export const SubstitutionFormTemplate: React.FC<SubstitutionFormTemplateProps> = ({
  formId = SUBSTITUTION_FORM_ID,
  name,
  setName,
  description,
  setDescription,
  linkUrl,
  setLinkUrl,
  price,
  setPrice,
  websiteName,
  setWebsiteName,
  isLoading,
  errorMsg,
  onSubmit,
  onCancel,
  hideActions = false,
}) => {
  return (
    <form id={formId} className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="substitution-name">
          Name
        </label>
        <Input
          id="substitution-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          placeholder="Alternative gift name"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="substitution-description">
          Notes
        </label>
        <Input
          id="substitution-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="substitution-link">
          Store link
        </label>
        <Input
          id="substitution-link"
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="substitution-website">
          Website name
        </label>
        <Input
          id="substitution-website"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="substitution-price">
          Price
        </label>
        <Input
          id="substitution-price"
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Optional"
        />
      </div>

      {errorMsg ? <p className={styles.error}>{errorMsg}</p> : null}

      {!hideActions ? (
        <div className={styles.actions}>
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      ) : null}
    </form>
  );
};
