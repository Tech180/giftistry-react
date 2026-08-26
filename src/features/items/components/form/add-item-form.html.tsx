import React, { useState } from 'react';
import {
  Link, Globe, DollarSign, Star, Plus, Trash2, Pin,
  Wand2, ChevronDown, AlertTriangle, Check, Undo2, Pencil, Sparkles, Search,
  Layers2, Infinity,
} from 'lucide-react';
import { Button, Chip, Switch, AiStatusBadge, NumberSelector } from 'shared/ui';
import { AddItemFormTemplateProps } from '../../interfaces/add-item-form-template-props.interface';
import { AudiencePicker } from '../audience-picker';
import { ItemPhotoGallery } from '../photo-gallery/item-photo-gallery.component';
import { SubstitutionManager } from '../item-presentation/substitution';
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
  warningMsg,
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
  canUseWebSearchOnList = false,
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleUpdateCustomField,
  editingCustomFieldNameId,
  onStartEditCustomFieldName,
  onFinishEditCustomFieldName,
  hasIncompleteCustomFields,
  showExtraFields,
  setShowExtraFields,
  renderedCategories,
  aiCategoryChips,
  aiCategoryIds,
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
  isMultiCount,
  isSuggestion,
  desiredQuantity,
  setDesiredQuantity,
  variations,
  setVariations,
  linkedItemIds,
  resolvedLinkedCount,
  relatedItemIds,
  resolvedRelatedCount,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
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
  showPhotoGallery,
  photoEntries,
  onPhotoEntriesChange,
  photoError,
  onPhotoError,
  readOnly = false,
  allowSubstitutions,
  setAllowSubstitutions,
  substitutionOptions,
  onOpenCreateSubstitution,
  onOpenEditSubstitution,
  onDeleteOwnerSubstitution,
  onReorderOwnerSubstitutions,
  substitutionEditor,
  formId,
}) => {
  const isSubstitutionSurface = !!substitutionEditor;
  const hasPeerItems = wishlistItems.filter((i) => i.Id !== itemId).length > 0;
  const [linkCopied, setLinkCopied] = useState(false);

  const isEditingCustomFieldName = (field: { id: string; name: string }) =>
    !field.name.trim() || editingCustomFieldNameId === field.id;

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
    <form id={formId} onSubmit={handleSubmit} className={styles.form}>
      <fieldset disabled={readOnly} className={styles['form-fieldset']}>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`} role="alert">
          <span>{errorMsg}</span>
        </div>
      )}
      {warningMsg && (
        <div className={`${styles['alert-warning']} animate-slide-up`} role="status">
          <AlertTriangle size={16} className={styles['alert-warning-icon']} aria-hidden />
          <span>{warningMsg}</span>
        </div>
      )}

      {showPhotoGallery && (
        <>
          <ItemPhotoGallery
            photos={photoEntries}
            onChange={onPhotoEntriesChange}
            disabled={isLoading || readOnly}
            errorMsg={photoError}
            onError={onPhotoError}
          />
          <div className={styles.divider} />
        </>
      )}
      </fieldset>

      {/* Item link: copy button stays outside disabled fieldsets in view mode */}
      <div className={styles.section}>
        <div className={styles['form-group']}>
          <div className={styles['link-label-row']}>
            <label className={styles.label}>Item Link</label>
            {canUseWebSearchOnList && !readOnly && (
              <span
                className={styles['web-search-indicator']}
                title="Web search enabled — scrape will also search the web for specs"
                aria-label="Web search enabled for this list"
                role="img"
              >
                <Search size={14} aria-hidden="true" />
              </span>
            )}
          </div>
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
            <fieldset disabled={readOnly} className={styles['link-input-fieldset']}>
              <input
                type="url"
                className={`${styles.input} ${styles['input-has-icon']} ${readOnly ? styles['input-has-icon-only'] : styles['input-has-action']}`}
                placeholder="Paste product URL..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                readOnly={readOnly}
                tabIndex={readOnly ? -1 : undefined}
              />
              {!readOnly && (
                <button
                  type="button"
                  onClick={handleScrapeClick}
                  disabled={isAutopopulating || isSummarizingNotes || !linkUrl.trim()}
                  className={`${styles['input-action']} ${isScrapeButtonPulsing ? styles['input-action-pulse'] : ''}`}
                  title="Auto-fill details from link"
                  aria-label="Auto-fill details from link"
                >
                  <Wand2 size={14} />
                </button>
              )}
            </fieldset>
          </div>
          {!readOnly && isAutopopulating && (
            <div className={styles['autopopulate-loader']}>
              <div className={styles.spinner} />
              <span>
                {canUseWebSearchOnList
                  ? 'Fetching product details and searching the web...'
                  : 'Fetching product details...'}
              </span>
            </div>
          )}
        </div>
      </div>

      <fieldset disabled={readOnly} className={styles['form-fieldset']}>
      {/* Section 1: Core details */}
      <div className={styles.section}>
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
            <NumberSelector
              value={typeof desiredQuantity === 'number' ? desiredQuantity : 1}
              min={0}
              onChange={setDesiredQuantity}
              decreaseLabel="Decrease quantity"
              increaseLabel="Increase quantity"
              zeroAsInfinity
              className={styles['qty-selector']}
            />
          </div>
          {!isSubstitutionSurface ? (
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
          ) : null}
        </div>
      </div>

      <div className={styles.divider} />

      {/* Section 2: Metadata & notes */}
      <div className={styles.section}>
        {!isSubstitutionSurface ? (
        <div className={styles['form-group']}>
          <label className={styles.label}>Category</label>
          {canShowAi &&
            aiCategoryChips.length === 0 &&
            category === 'uncategorized' &&
            renderedCategories.every((cat) => !cat.isCustom && !cat.isFromList) && (
            <p className={styles['ai-category-hint']}>
              Assigned automatically when you auto-fill from a product link.
            </p>
          )}
          <div className={styles['chip-group']}>
            {aiCategoryChips.map((chip) => {
              const isSelected = category === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  className={[
                    styles['ai-category-chip'],
                    chip.variant === 'suggestion' ? styles['ai-category-chip-suggestion'] : '',
                    isSelected ? styles['ai-category-chip-active'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setCategory(isSelected ? 'uncategorized' : chip.id)}
                  aria-pressed={isSelected}
                >
                  <Sparkles size={11} className={styles['ai-category-icon']} aria-hidden="true" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
            {renderedCategories
              .filter((cat) => !canShowAi || cat.isCustom || cat.isFromList)
              .filter((cat) => !aiCategoryIds.has(cat.id))
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
        ) : null}

        {!isSubstitutionSurface ? (
        <div className={styles['form-group']}>
          <label className={styles.label}>
            Priority <span className={styles['label-hint']}>(1 is highest)</span>
          </label>
          <div className={styles['priority-input-wrap']}>
            <input
              type="number"
              className={`${styles.input} ${styles['input-narrow']}`}
              min="1"
              aria-label="Priority weight"
              value={priorityWeight}
              onChange={(e) => setPriorityWeight(e.target.value)}
            />
            {!priorityWeight && (
              <span className={styles['priority-placeholder']} aria-hidden="true">
                1–<Infinity size={14} />
              </span>
            )}
          </div>
        </div>
        ) : null}

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
                    iconOnly
                    onClick={onUndoSummarize}
                    disabled={isSummarizingNotes || isAutopopulating || isLoading}
                    aria-label="Undo summarize"
                    title="Undo summarize"
                    leftIcon={<Undo2 size={14} />}
                  />
                )}
                <AiStatusBadge
                  enabled
                  label="Summarize"
                  onToggle={onSummarizeNotes}
                  disabled={isSummarizingNotes || isAutopopulating || isLoading}
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
                          <label className={styles.label} style={{ textTransform: 'none' }}>
                            {field.name}
                          </label>
                        )}
                        <div className={styles['custom-field-label-actions']}>
                          {!isEditingCustomFieldName(field) && (
                            <button
                              type="button"
                              className={styles['custom-field-edit-btn']}
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

        {hasPeerItems && !readOnly && !isMultiCount && !isSuggestion && !isSubstitutionSurface && (
          <div className={styles['form-group']}>
            <label className={styles.label}>Linked Items</label>
            <div className={styles['linked-row']}>
              <p className={styles['linked-hint']}>
                These gifts go together. People who claim one can claim the rest at the same time.
              </p>
              <button
                type="button"
                onClick={() => setIsLinkingModeActive(true)}
                className={`${styles['dependency-btn']} ${isLinkingModeActive ? styles['dependency-active'] : ''}`}
                title="Select linked items from wishlist"
                aria-pressed={isLinkingModeActive}
              >
                <Link size={16} />
                {resolvedLinkedCount > 0 && (
                  <span className={styles['dependency-badge']}>{resolvedLinkedCount}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {hasPeerItems && !readOnly && !isSubstitutionSurface && (
          <div className={styles['form-group']}>
            <label className={styles.label}>Related Items</label>
            <div className={styles['linked-row']}>
              <p className={styles['linked-hint']}>
                These gifts go well together, but people claim each one on their own.
              </p>
              <button
                type="button"
                onClick={() => setIsRelatingModeActive(true)}
                className={`${styles['dependency-btn']} ${isRelatingModeActive ? styles['dependency-active'] : ''}`}
                title="Select related items from wishlist"
                aria-pressed={isRelatingModeActive}
              >
                <Layers2 size={16} />
                {resolvedRelatedCount > 0 && (
                  <span className={styles['dependency-badge']}>{resolvedRelatedCount}</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {!isSubstitutionSurface ? (
        <>
      <div className={styles.divider} />

      {/* Section 3: Visibility & sharing */}
      <div className={styles.section}>
        {isOwner && !isSuggestion && (
          <SubstitutionManager
            parentItemId={itemId}
            options={substitutionOptions}
            allowSubstitutions={allowSubstitutions}
            onAllowSubstitutionsChange={setAllowSubstitutions}
            onOpenCreate={onOpenCreateSubstitution}
            onOpenEdit={onOpenEditSubstitution}
            onDelete={onDeleteOwnerSubstitution}
            onReorder={onReorderOwnerSubstitutions}
            disabled={isLoading || readOnly}
          />
        )}

        <AudiencePicker
          listShares={listShares}
          selectedUserIds={sharedWithUserIds}
          onChange={setSharedWithUserIds}
          visibilityMode={visibilityMode}
          onVisibilityModeChange={onVisibilityModeChange}
          disabled={isLoading || readOnly}
        />

        {!isOwner && (
          <>
            <div className={styles['switch-row']}>
              <label htmlFor="visible-to-list-owner" className={styles['switch-label']}>
                Visible to list owner
              </label>
              <Switch
                id="visible-to-list-owner"
                checked={!isHiddenIdea}
                onChange={(visible) => setIsHiddenIdea(!visible)}
                size="sm"
                aria-label="Visible to list owner"
              />
            </div>

            <div className={styles['switch-row']}>
              <label htmlFor="visible-to-other-collaborators" className={styles['switch-label']}>
                Visible to Other Collaborators
              </label>
              <Switch
                id="visible-to-other-collaborators"
                checked={otherUsersCanSee}
                onChange={setOtherUsersCanSee}
                size="sm"
                aria-label="Visible to Other Collaborators"
              />
            </div>

            {!isEdit && (
              <div className={styles['switch-row']}>
                <label htmlFor="claim-this-item-immediately" className={styles['switch-label']}>
                  Claim this Item Immediately
                </label>
                <Switch
                  id="claim-this-item-immediately"
                  checked={claimOnCreate}
                  onChange={setClaimOnCreate}
                  size="sm"
                />
              </div>
            )}
          </>
        )}
      </div>
        </>
      ) : !isOwner &&
        (substitutionEditor?.mode === 'create'
          ? substitutionEditor.kind === 'claimer_custom'
          : substitutionEditor?.option.Kind === 'claimer_custom') ? (
        <>
          <div className={styles.divider} />
          <div className={styles.section}>
            <div className={styles['switch-row']}>
              <label htmlFor="sub-visible-to-list-owner" className={styles['switch-label']}>
                Visible to list owner
              </label>
              <Switch
                id="sub-visible-to-list-owner"
                checked={!isHiddenIdea}
                onChange={(visible) => setIsHiddenIdea(!visible)}
                size="sm"
                aria-label="Visible to list owner"
              />
            </div>

            {substitutionEditor.mode === 'create' ? (
              <div className={styles['switch-row']}>
                <label htmlFor="sub-claim-this-item-immediately" className={styles['switch-label']}>
                  Claim this Item Immediately
                </label>
                <Switch
                  id="sub-claim-this-item-immediately"
                  checked={claimOnCreate}
                  onChange={setClaimOnCreate}
                  size="sm"
                  aria-label="Claim this Item Immediately"
                />
              </div>
            ) : null}
          </div>
        </>
      ) : null}
      </fieldset>
    </form>
  );
};
