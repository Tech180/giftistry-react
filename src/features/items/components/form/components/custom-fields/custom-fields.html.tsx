import React from 'react';
import { AlertTriangle, ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './custom-fields.module.css';

export const CustomFieldsTemplate: React.FC<TemplateProps> = ({
  category,
  getFriendlyCategoryLabel,
  showExtraFields,
  setShowExtraFields,
  hasIncompleteCustomFields,
  warningBadgeRevealed,
  onWarningBadgeReveal,
  showFieldDefinitions,
  definitions,
  isFieldVisible,
  dynamicValues,
  handleUpdateDynamicValue,
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleUpdateCustomField,
  editingCustomFieldNameId,
  onStartEditCustomFieldName,
  onFinishEditCustomFieldName,
  isEditingCustomFieldName,
}) => (
  <div className={styles['custom-fields']}>
    <button
      type="button"
      className={styles['custom-fields__expandable-header']}
      onClick={() => setShowExtraFields(!showExtraFields)}
      aria-expanded={showExtraFields}
    >
      <span>Custom Fields</span>
      <span className={styles['custom-fields__expandable-header-end']}>
        {hasIncompleteCustomFields && (
          <span
            className={[
              styles['custom-fields__warning-badge'],
              warningBadgeRevealed ? styles['custom-fields__warning-badge--revealed'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseEnter={() => onWarningBadgeReveal(true)}
            onMouseLeave={() => onWarningBadgeReveal(false)}
            onFocus={() => onWarningBadgeReveal(true)}
            onBlur={() => onWarningBadgeReveal(false)}
            role="note"
            aria-label="Each custom field needs both a name and a value"
          >
            <AlertTriangle size={14} className={styles['custom-fields__warning-icon']} />
            <span
              className={[
                styles['custom-fields__warning-text'],
                warningBadgeRevealed ? styles['custom-fields__warning-text--revealed'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Name and value required
            </span>
          </span>
        )}
        <span
          className={[
            styles['custom-fields__header-icon'],
            showExtraFields ? styles['custom-fields__header-icon--open'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <ChevronDown size={16} />
        </span>
      </span>
    </button>
    <div
      className={[
        styles['custom-fields__expandable-content'],
        showExtraFields ? styles['custom-fields__expandable-content--open'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showFieldDefinitions && definitions.length > 0 && (
        <>
          <h4 className={styles['custom-fields__panel-title']}>
            {getFriendlyCategoryLabel(category)} Sizing / Options
          </h4>
          <div className={styles['custom-fields__grid']}>
            {definitions.filter(isFieldVisible).map((def) => (
              <div key={def.Id} className={styles['custom-fields__form-group']}>
                <label
                  className={`${styles['custom-fields__label']} ${styles['custom-fields__label--plain']}`}
                >
                  {def.Label}
                </label>
                <input
                  type="text"
                  className={styles['custom-fields__input']}
                  placeholder={def.Placeholder || ''}
                  value={dynamicValues[def.FieldKey] || ''}
                  onChange={(e) => handleUpdateDynamicValue(def.FieldKey, e.target.value)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {customFields.length === 0 ? (
        <p className={styles['custom-fields__no-fields']}>No custom fields added yet.</p>
      ) : (
        <>
          {showFieldDefinitions && definitions.length > 0 && (
            <h4 className={styles['custom-fields__panel-title']}>Additional Fields</h4>
          )}
          <div className={styles['custom-fields__grid']}>
            {customFields.map((field) => (
              <div key={field.id} className={styles['custom-fields__form-group']}>
                <div className={styles['custom-fields__label-row']}>
                  {isEditingCustomFieldName(field) ? (
                    <input
                      type="text"
                      className={`${styles['custom-fields__input']} ${styles['custom-fields__name-input']}`}
                      placeholder="Field name"
                      value={field.name}
                      autoFocus={editingCustomFieldNameId === field.id || !field.name.trim()}
                      onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                      onBlur={onFinishEditCustomFieldName}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          onFinishEditCustomFieldName();
                        }
                      }}
                    />
                  ) : (
                    <label
                      className={`${styles['custom-fields__label']} ${styles['custom-fields__label--plain']}`}
                    >
                      {field.name}
                    </label>
                  )}
                  <div className={styles['custom-fields__label-actions']}>
                    {!isEditingCustomFieldName(field) && (
                      <button
                        type="button"
                        className={styles['custom-fields__edit-btn']}
                        onClick={() => onStartEditCustomFieldName(field.id)}
                        title="Edit field name"
                        aria-label={`Edit ${field.name} field name`}
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (editingCustomFieldNameId === field.id) {
                          onFinishEditCustomFieldName();
                        }
                        handleRemoveCustomField(field.id);
                      }}
                      className={styles['custom-fields__remove-btn']}
                      title="Remove field"
                      aria-label={`Remove ${field.name || 'custom'} field`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  className={styles['custom-fields__input']}
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <button type="button" className={styles['custom-fields__add-btn']} onClick={handleAddCustomField}>
        <Plus size={14} /> Add Field
      </button>
    </div>
  </div>
);
