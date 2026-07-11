import React, { useState } from 'react';
import {
  Link, Globe, DollarSign, Star, Plus, Trash2, Pin,
  Wand2, ChevronDown, Gift, AlertTriangle, Check, Undo2, Pencil,
} from 'lucide-react';
import { Button, Chip, Switch, AiStatusBadge } from 'shared/ui';
import { AddItemFormTemplateProps } from '../../interfaces/add-item-form-template-props.interface';
import { AudiencePicker } from '../audience-picker';
import styles from './add-item-form.module.css';

export const ADD_ITEM_FORM_ID = 'add-item-form';

export const AddItemFormTemplate: React.FC<AddItemFormTemplateProps> = ({
  name,
  setName,
  description,
  setDescription,
  priorityWeight,
  setPriorityWeight,
  isHiddenIdea,
  setIsHiddenIdea,
  isOwner,
  isLoading,
  errorMsg,
  handleSubmit,
  linkUrl,
  setLinkUrl,
  websiteName,
  setWebsiteName,
  category,
  setCategory,
  price,
  setPrice,
  isFavorite,
  setIsFavorite,
  isAutopopulating,
  handleScrapeClick,
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleUpdateCustomField,
  hasIncompleteCustomFields,
  showExtraFields,
  setShowExtraFields,
  renderedCategories,
  isAddingCustom,
  setIsAddingCustom,
  newCustomInput,
  setNewCustomInput,
  handleAddCustomCategory,
  handleDeleteCustomCategory,
  isScrapeButtonPulsing,
  isEdit,
  definitions,
  dynamicValues,
  isFieldVisible,
  handleUpdateDynamicValue,
  otherUsersCanSee,
  setOtherUsersCanSee,
  claimOnCreate,
  setClaimOnCreate,
  desiredQuantity,
  setDesiredQuantity,
  variations,
  setVariations,
  linkedItemIds,
  resolvedLinkedCount,
  isLinkingModeActive,
  setIsLinkingModeActive,
  wishlistItems = [],
  itemId,
  getFriendlyCategoryLabel,
  showFieldDefinitions,
  varName,
  setVarName,
  varQty,
  varError,
  handleAddVariation,
  handleVarQtyChange,
  listShares,
  sharedWithUserIds,
  setSharedWithUserIds,
  visibilityMode,
  onVisibilityModeChange,
  canSummarizeNotes,
  isSummarizingNotes,
  canUndoSummarize,
  onSummarizeNotes,
  onUndoSummarize,
  canShowAi = false,
}) => {
  const hasLinkedItems = wishlistItems.filter((i) => i.Id !== itemId).length > 0;
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingNameFieldId, setEditingNameFieldId] = useState<string | null>(null);

  const isEditingCustomFieldName = (field: { id: string; name: string }) =>
    !field.name.trim() || editingNameFieldId === field.id;

  const finishEditingCustomFieldName = () => {
    setEditingNameFieldId(null);
  };

  const handleCopyLink = async () => {
    if (!linkUrl.trim()) return;
    try {
      await navigator.clipboard.writeText(linkUrl.trim());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no-op
    }
  };

  return (
    <form id={ADD_ITEM_FORM_ID} onSubmit={handleSubmit} className={styles.form}>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`}>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Section 1: Core details */}
      <div className={styles.section}>
        <div className={styles['form-group']}>
          <label className={styles.label}>Item Link</label>
          <div className={styles['input-wrapper']}>
            <button
              type="button"
              className={styles['input-icon']}
              onClick={handleCopyLink}
              disabled={!linkUrl.trim()}
              title={linkCopied ? 'Copied!' : 'Copy link'}
              aria-label={linkCopied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
            >
              {linkCopied ? <Check size={16} /> : <Link size={16} />}
            </button>
            <input
              type="url"
              className={`${styles.input} ${styles['input-has-icon']} ${styles['input-has-action']}`}
              placeholder="Paste product URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handleScrapeClick}
              disabled={isAutopopulating || !linkUrl.trim()}
              className={`${styles['input-action']} ${isScrapeButtonPulsing ? styles['input-action-pulse'] : ''}`}
              title="Auto-fill details from link"
            >
              <Wand2 size={14} />
            </button>
          </div>
          {isAutopopulating && (
            <div className={styles['autopopulate-loader']}>
              <div className={styles.spinner} />
              <span>Fetching product details...</span>
            </div>
          )}
        </div>

        <div className={styles['form-group']}>
          <label className={styles.label}>Website Name</label>
          <div className={styles['input-wrapper']}>
            <span className={styles['input-icon']}><Globe size={14} /></span>
            <input
              type="text"
              className={`${styles.input} ${styles['input-has-icon']}`}
              placeholder="Amazon, Target"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles['form-group']}>
          <label className={styles.label}>
            Item Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Sony WH-1000XM5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={`${styles['form-row']} ${styles['form-row-price']}`}>
          <div className={styles['form-group']}>
            <label className={styles.label}>Price</label>
            <div className={styles['input-wrapper']}>
              <span className={styles['input-icon']} style={{ left: 10 }}><DollarSign size={14} /></span>
              <input
                type="text"
                className={styles.input}
                style={{ paddingLeft: 30 }}
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(val)) setPrice(val);
                }}
              />
            </div>
          </div>
          <div className={styles['form-group']}>
            <label className={styles.label}>Qty</label>
            <input
              type="number"
              className={`${styles.input} ${styles['input-qty']}`}
              min="1"
              value={desiredQuantity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') setDesiredQuantity('');
                else {
                  const num = parseInt(val, 10);
                  if (!isNaN(num)) setDesiredQuantity(Math.max(1, num));
                }
              }}
            />
          </div>
          <div className={styles['form-group']}>
            <label className={`${styles.label} ${styles['label-center']}`}>
              {isOwner ? 'Favorite' : 'Pin'}
            </label>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`${styles['btn-star']} ${isOwner
                ? (isFavorite ? styles['btn-star-active'] : '')
                : (isFavorite ? styles['btn-pin-active'] : '')}`}
              title={isOwner
                ? (isFavorite ? 'Remove Favorite' : 'Mark as Favorite')
                : (isFavorite ? 'Unpin Item' : 'Pin Item')}
            >
              {isOwner ? (
                <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              ) : (
                <Pin size={16} fill={isFavorite ? 'currentColor' : 'none'} style={{ transform: isFavorite ? 'rotate(45deg)' : 'none' }} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      {/* Section 2: Metadata & notes */}
      <div className={styles.section}>
        <div className={styles['form-group']}>
          <label className={styles.label}>Category</label>
          {canShowAi && category === 'uncategorized' && renderedCategories.every((cat) => !cat.isCustom && !cat.isFromList) && (
            <p className={styles['ai-category-hint']}>
              Assigned automatically when you auto-fill from a product link.
            </p>
          )}
          <div className={styles['chip-group']}>
            {renderedCategories
              .filter((cat) => !canShowAi || cat.isCustom || cat.isFromList)
              .map((cat) => {
                const isSelected = category === cat.id;
                if (cat.isCustom) {
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles['chip-custom-btn']} ${isSelected ? styles['chip-custom-btn-active'] : ''}`}
                      onClick={() => setCategory(isSelected ? 'uncategorized' : cat.id)}
                    >
                      <span>{cat.label}</span>
                      <span
                        className={styles['delete-category-btn']}
                        onClick={(e) => { e.stopPropagation(); handleDeleteCustomCategory(cat.id); }}
                        title="Delete Category"
                      >
                        &times;
                      </span>
                    </button>
                  );
                }
                return (
                  <Chip
                    key={cat.id}
                    label={cat.label}
                    isActive={isSelected}
                    onClick={() => setCategory(isSelected ? 'uncategorized' : cat.id)}
                  />
                );
              })}
            {!isAddingCustom ? (
              <Chip
                label="+ Add"
                onClick={() => { setIsAddingCustom(true); setNewCustomInput(''); }}
                className={styles['chip-dashed']}
              />
            ) : null}
          </div>
          {isAddingCustom && (
            <div className={`${styles['custom-category-row']} animate-slide-up`}>
              <input
                type="text"
                className={`${styles.input} ${styles['custom-category-input']}`}
                placeholder="Category name..."
                value={newCustomInput}
                onChange={(e) => setNewCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); handleAddCustomCategory(); }
                }}
                autoFocus
              />
              <Button type="button" variant="primary" size="sm" className={styles['add-btn-sm']} onClick={handleAddCustomCategory}>Add</Button>
              <Button type="button" variant="secondary" size="sm" className={styles['add-btn-sm']} onClick={() => setIsAddingCustom(false)}>Cancel</Button>
            </div>
          )}
        </div>

        <div className={styles['form-group']}>
          <label className={styles.label}>
            Priority <span className={styles['label-hint']}>(1 is highest)</span>
          </label>
          <input
            type="number"
            className={`${styles.input} ${styles['input-narrow']}`}
            min="1"
            placeholder="1-5"
            value={priorityWeight}
            onChange={(e) => setPriorityWeight(e.target.value)}
          />
        </div>

        <div className={styles['form-group']}>
          <div className={styles['notes-label-row']}>
            <label className={styles.label}>Notes &amp; Details</label>
            {canSummarizeNotes && (
              <div className={styles['notes-actions']}>
                {canUndoSummarize && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onUndoSummarize}
                    disabled={isSummarizingNotes || isLoading}
                  >
                    <Undo2 size={14} />
                    Undo
                  </Button>
                )}
                <AiStatusBadge
                  enabled
                  label="Summarize"
                  onToggle={onSummarizeNotes}
                  disabled={isSummarizingNotes || isLoading}
                />
              </div>
            )}
          </div>
          {isSummarizingNotes && (
            <p className={styles['summarize-status']}>Generating notes...</p>
          )}
          <textarea
            className={styles.input}
            placeholder="Add specific details, reasons you want this, or alternative options..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className={`${styles['expandable-section']} ${showExtraFields ? styles['expandable-open'] : ''}`}>
          <button
            type="button"
            className={styles['expandable-header']}
            onClick={() => setShowExtraFields(!showExtraFields)}
            aria-expanded={showExtraFields}
          >
            <span>Custom Fields</span>
            <span className={styles['expandable-header-end']}>
              {hasIncompleteCustomFields && (
                <span
                  className={styles['warning-badge']}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="note"
                  aria-label="Each custom field needs both a name and a value"
                >
                  <AlertTriangle size={14} className={styles['warning-icon']} />
                  <span className={styles['warning-text']}>Name and value required</span>
                </span>
              )}
              <span className={styles['header-icon']}><ChevronDown size={16} /></span>
            </span>
          </button>
          <div className={styles['expandable-content']}>
            {showFieldDefinitions && definitions.length > 0 && (
              <>
                <h4 className={styles['panel-title']}>{getFriendlyCategoryLabel(category)} Sizing / Options</h4>
                <div className={styles['grid2-col']}>
                  {definitions.filter(isFieldVisible).map((def) => (
                    <div key={def.Id} className={styles['form-group']}>
                      <label className={styles.label} style={{ textTransform: 'none' }}>{def.Label}</label>
                      <input
                        type="text"
                        className={styles.input}
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
              <p className={styles['no-custom-fields']}>No custom fields added yet.</p>
            ) : (
              <>
                {showFieldDefinitions && definitions.length > 0 && (
                  <h4 className={styles['panel-title']}>Additional Fields</h4>
                )}
                <div className={styles['grid2-col']}>
                  {customFields.map((field) => (
                    <div key={field.id} className={styles['form-group']}>
                      <div className={styles['custom-field-label-row']}>
                        {isEditingCustomFieldName(field) ? (
                          <input
                            type="text"
                            className={`${styles.input} ${styles['custom-field-name-input']}`}
                            placeholder="Field name"
                            value={field.name}
                            autoFocus={editingNameFieldId === field.id || !field.name.trim()}
                            onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                            onBlur={finishEditingCustomFieldName}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                finishEditingCustomFieldName();
                              }
                            }}
                          />
                        ) : (
                          <label className={styles.label} style={{ textTransform: 'none' }}>
                            {field.name}
                          </label>
                        )}
                        <div className={styles['custom-field-label-actions']}>
                          {!isEditingCustomFieldName(field) && (
                            <button
                              type="button"
                              className={styles['custom-field-edit-btn']}
                              onClick={() => setEditingNameFieldId(field.id)}
                              title="Edit field name"
                              aria-label={`Edit ${field.name} field name`}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (editingNameFieldId === field.id) {
                                finishEditingCustomFieldName();
                              }
                              handleRemoveCustomField(field.id);
                            }}
                            className={styles['custom-field-remove-btn']}
                            title="Remove field"
                            aria-label={`Remove ${field.name || 'custom'} field`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            <button type="button" className={styles['add-field-btn']} onClick={handleAddCustomField}>
              <Plus size={14} /> Add Field
            </button>
          </div>
        </div>

        {typeof desiredQuantity === 'number' && desiredQuantity > 1 && (
          <div className={styles['variations-block']}>
            <span className={styles['variation-badge']}>
              {variations.reduce((sum, v) => sum + v.quantity, 0)}/{desiredQuantity}
            </span>
            <label className={styles.label}>Item Variations</label>
            {varError && <div className={styles.alert}><span>{varError}</span></div>}
            <div className={styles['variation-row']}>
              <input
                type="text"
                className={`${styles.input} ${styles['variation-name']}`}
                placeholder="e.g. Red, Size M"
                value={varName}
                onChange={(e) => setVarName(e.target.value)}
              />
              <input
                type="number"
                min="1"
                className={`${styles.input} ${styles['variation-qty']}`}
                value={varQty}
                onChange={(e) => handleVarQtyChange(e.target.value)}
              />
              <Button type="button" variant="secondary" size="sm" className={styles['add-btn-sm']} onClick={handleAddVariation}>Add</Button>
            </div>
            <div className={styles['variations-list']}>
              {variations.map((v, idx) => (
                <span key={idx} className={styles['variation-chip']}>
                  {v.name} ({v.quantity})
                  <button type="button" onClick={() => setVariations((prev) => prev.filter((_, i) => i !== idx))} className={styles['remove-variation-btn']}>&times;</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {hasLinkedItems && (
          <div className={styles['form-group']}>
            <label className={styles.label}>Linked Items</label>
            <div className={styles['linked-row']}>
              <p className={styles['linked-hint']}>
                Link this item to other gifts with the same visibility (Everyone, Only Me, or the same specific people).
              </p>
              <button
                type="button"
                onClick={() => setIsLinkingModeActive((prev) => !prev)}
                className={`${styles['dependency-btn']} ${isLinkingModeActive ? styles['dependency-active'] : ''}`}
                title={isLinkingModeActive ? 'Finish Selecting Items' : 'Select Items from Wishlist'}
              >
                <Link size={16} />
                {resolvedLinkedCount > 0 && (
                  <span className={styles['dependency-badge']}>{resolvedLinkedCount}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.divider} />

      {/* Section 3: Visibility & sharing */}
      <div className={styles.section}>
        <AudiencePicker
          listShares={listShares}
          selectedUserIds={sharedWithUserIds}
          onChange={setSharedWithUserIds}
          visibilityMode={visibilityMode}
          onVisibilityModeChange={onVisibilityModeChange}
          disabled={isLoading}
        />

        {!isOwner && (
          <>
            <div className={styles['switch-row']}>
              <span className={styles['switch-label']}>
                <span className={styles['switch-icon']}><Gift size={14} /></span>
                Suggest as Surprise
              </span>
              <Switch
                checked={isHiddenIdea}
                onChange={setIsHiddenIdea}
                size="sm"
                aria-label="Suggest as surprise idea"
              />
            </div>

            <div className={styles['switch-row']}>
              <span className={styles['switch-label']}>Visible to Other Collaborators</span>
              <Switch
                checked={otherUsersCanSee}
                onChange={setOtherUsersCanSee}
                size="sm"
                aria-label="Visible to other collaborators"
              />
            </div>

            {!isEdit && (
              <div className={styles['switch-row']}>
                <span className={styles['switch-label']}>Claim this Item Immediately</span>
                <Switch
                  checked={claimOnCreate}
                  onChange={setClaimOnCreate}
                  size="sm"
                  aria-label="Claim this item immediately"
                />
              </div>
            )}
          </>
        )}
      </div>
    </form>
  );
};
