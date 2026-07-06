import React from 'react';
import { Tag, FileText, Link, Globe, DollarSign, Star, Plus, Trash2, Pin } from 'lucide-react';
import { Input, Button } from 'shared/ui';
import { AddItemFormTemplateProps } from '../../interfaces/add-item-form-template-props.interface';
import styles from './add-item-form.module.css';

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
  hasScraped,
  handleScrapeClick,
  pantsSize,
  setPantsSize,
  shirtSize,
  setShirtSize,
  shoesSize,
  setShoesSize,
  socksSize,
  setSocksSize,
  color,
  setColor,
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleUpdateCustomField,
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
  currentUserId,
  otherUsersCanSee,
  setOtherUsersCanSee,
  claimOnCreate,
  setClaimOnCreate,
  isMultiCount,
  desiredQuantity,
  setDesiredQuantity,
  variations,
  setVariations,
  linkedItemIds,
  setLinkedItemIds,
  wishlistItems = [],
  itemId,
  isLinkingModeActive,
  setIsLinkingModeActive,
  getFriendlyCategoryLabel,
  showOptionalSizing,
  varName,
  setVarName,
  varQty,
  varError,
  handleAddVariation,
  handleVarQtyChange,
}) => {
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`}>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Link / URL & Website Name (First) */}
      <div className={styles['grid2-col']}>
        <div className={styles['field-group']}>
          <Input
            label="Link / URL"
            type="url"
            placeholder="https://example.com/gift-link"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            leftIconClickable={true}
            leftIcon={
              <button
                type="button"
                onClick={handleScrapeClick}
                disabled={isAutopopulating || !linkUrl.trim()}
                className={`${styles['scrape-button']} ${isScrapeButtonPulsing ? styles['pulse-click-me'] : ''
                  }`}
                title="Click to automatically fill item details"
              >
                <Link size={16} />
              </button>
            }
          />
          {isAutopopulating && (
            <div className={styles['autopopulate-loader']}>
              <div className={styles.spinner} />
              <span>Fetching product details...</span>
            </div>
          )}
        </div>
        <div className={styles['field-group']}>
          <Input
            label="Website Name"
            type="text"
            placeholder="Amazon, Target"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            leftIcon={<Globe size={16} />}
          />
        </div>
      </div>

      {/* 2. Item Name & Price & Favorite */}
      <div className={styles['form-row']}>
        <Input
          label="Item Name *"
          type="text"
          placeholder="Mechanical Keyboard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<Tag size={16} />}
          required
        />
      </div>
      <div className={styles['price-row']}>
        <div className={styles['price-input-wrapper']} style={{ flex: 2 }}>
          <Input
            label="Price"
            type="text"
            placeholder="49.99"
            value={price}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(val)) {
                setPrice(val);
              }
            }}
            leftIcon={<DollarSign size={16} />}
          />
        </div>
        <div className={styles['price-input-wrapper']} style={{ flex: 1 }}>
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={desiredQuantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') {
                setDesiredQuantity('');
              } else {
                const num = parseInt(val, 10);
                if (!isNaN(num)) {
                  setDesiredQuantity(Math.max(1, num));
                }
              }
            }}
          />
        </div>
        <div className={styles['star-wrapper']}>
          <span className={styles['star-label']}>{isOwner ? 'Favorite' : 'Pin'}</span>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${styles['star-toggle-btn']} ${isOwner ? (isFavorite ? styles['star-toggle-btn-active'] : '') : (isFavorite ? styles['pin-toggle-btn-active'] : styles['pin-toggle-btn'])}`}
            title={isOwner ? (isFavorite ? 'Remove Favorite' : 'Mark as Favorite') : (isFavorite ? 'Unpin Item' : 'Pin Item')}
            style={{ height: '40px' }}
          >
            {isOwner ? (
              <Star
                size={18}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
              />
            ) : (
              <Pin
                size={18}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                style={{ transform: isFavorite ? 'rotate(45deg)' : 'none' }}
              />
            )}
          </button>
        </div>
      </div>

      {typeof desiredQuantity === 'number' && desiredQuantity > 1 && (
        <div className={styles['checkbox-wrapper']} style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          <div className={styles['variation-box-qty-badge']}>
            {variations.reduce((sum, v) => sum + v.quantity, 0)}/{desiredQuantity}
          </div>
          <div className={styles['field-group']}>
            <label className={styles.label} style={{ marginBottom: '8px', display: 'block' }}>Item Variations</label>
            {varError && (
              <div className={`${styles.alert} animate-slide-up`} style={{ marginBottom: '12px', marginTop: '4px' }}>
                <span>{varError}</span>
              </div>
            )}
            <div className={styles['variation-input-row']}>
              <Input
                type="text"
                placeholder="e.g. Red, Blue, Size M"
                value={varName}
                onChange={(e) => setVarName(e.target.value)}
                className={styles['variation-name-field']}
              />
              <Input
                type="number"
                min="1"
                value={varQty}
                onChange={(e) => handleVarQtyChange(e.target.value)}
                className={styles['variation-qty-field']}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddVariation}
              >
                Add
              </Button>
            </div>
            <div className={styles['variations-list']}>
              {variations.map((v, idx) => (
                <span key={idx} className={styles['variation-chip']}>
                  {v.name} ({v.quantity})
                  <button
                    type="button"
                    onClick={() => setVariations(prev => prev.filter((_, i) => i !== idx))}
                    className={styles['remove-variation-btn']}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Gift Category Matrix */}
      <div className={styles['field-group']}>
        <label className={styles['field-label']}>Gift Category</label>
        <div className="input-panel input-panel-padded">
            <div className={styles['category-chips-container']}>
          {renderedCategories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <Button
                key={cat.id}
                type="button"
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                className={cat.isCustom ? styles['category-chip-custom'] : ''}
                onClick={() => {
                  if (isSelected) {
                    setCategory('uncategorized');
                  } else {
                    setCategory(cat.id);
                  }
                }}
              >
                <span>{cat.label}</span>
                {cat.isCustom && (
                  <span
                    className={styles['delete-category-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomCategory(cat.id);
                    }}
                    title="Delete Category"
                  >
                    &times;
                  </span>
                )}
              </Button>
            );
          })}

          {isAddingCustom ? (
            <div className={`${styles['custom-category-row']} animate-slide-up`}>
              <Input
                type="text"
                variant="inline"
                placeholder="Category name..."
                value={newCustomInput}
                onChange={(e) => setNewCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomCategory();
                  }
                }}
                className={styles['custom-category-input-field']}
                autoFocus
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleAddCustomCategory}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingCustom(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className={styles['add-custom-chip']}
              onClick={() => {
                setIsAddingCustom(true);
                setNewCustomInput('');
              }}
            >
              + Custom
            </Button>
          )}
            </div>
        </div>
      </div>

      {/* 4. Description Section */}
      <div className={`${styles['field-group']} ${styles['field-group-labeled']}`}>
        <label className={styles['field-label']}>Description</label>
        <div className={`input-panel ${styles['textarea-panel']}`}>
          <span className={styles['textarea-icon']}><FileText size={16} /></span>
          <textarea
            placeholder="Add details, size details, or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`input-panel-field ${styles['textarea-inner']}`}
            rows={3}
          />
        </div>
      </div>

      {/* Collapsible Optional & Custom Description Fields */}
      <div className={styles['extra-fields-toggle-row']}>
        <button
          type="button"
          onClick={() => setShowExtraFields(!showExtraFields)}
          className={styles['extra-fields-toggle-btn']}
        >
          <span>{showExtraFields ? 'Hide Custom Fields ▲' : 'Show Custom Fields ▼'}</span>
          {customFields.length > 0 && (
            <span className={styles['custom-field-count-bubble']}>
              {customFields.length}
            </span>
          )}
        </button>
      </div>

      {showExtraFields && (
        <div className={`${styles['extra-fields-panel']} animate-slide-up`}>
          {showOptionalSizing && (
            definitions.length > 0 ? (
              <>
                <h4 className={styles['panel-title']}>{getFriendlyCategoryLabel(category)} Sizing / Options</h4>
                <div className={styles['grid2-col']}>
                  {definitions.filter(isFieldVisible).map((def) => (
                    <Input
                      key={def.Id}
                      label={def.Label}
                      type="text"
                      placeholder={def.Placeholder || ''}
                      value={dynamicValues[def.FieldKey] || ''}
                      onChange={(e) => handleUpdateDynamicValue(def.FieldKey, e.target.value)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h4 className={styles['panel-title']}>Clothing Sizes</h4>
                <div className={styles['grid2-col']}>
                  <Input
                    label="Pants Size"
                    type="text"
                    placeholder="32x30"
                    value={pantsSize}
                    onChange={(e) => setPantsSize(e.target.value)}
                  />
                  <Input
                    label="Shirt Size"
                    type="text"
                    placeholder="Medium, 15.5"
                    value={shirtSize}
                    onChange={(e) => setShirtSize(e.target.value)}
                  />
                  <Input
                    label="Shoes Size"
                    type="text"
                    placeholder="10.5"
                    value={shoesSize}
                    onChange={(e) => setShoesSize(e.target.value)}
                  />
                  <Input
                    label="Socks Size"
                    type="text"
                    placeholder="9-11"
                    value={socksSize}
                    onChange={(e) => setSocksSize(e.target.value)}
                  />
                </div>

                <Input
                  label="Preferred Color"
                  type="text"
                  placeholder="Navy Blue, Matte Black"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </>
            )
          )}

          <div className={styles['custom-fields-section-header']}>
            <h4 className={styles['panel-title']} style={{ margin: 0, border: 'none', padding: 0 }}>Custom Fields</h4>
            <button
              type="button"
              onClick={handleAddCustomField}
              className={styles['add-custom-field-btn']}
            >
              <Plus size={12} /> Add Field
            </button>
          </div>

          {customFields.length === 0 ? (
            <p className={styles['no-custom-fields-text']}>No custom fields added yet.</p>
          ) : (
            <div className={styles['custom-fields-list']}>
              {customFields.map((field) => (
                <div key={field.id} className={styles['custom-field-row']}>
                  <Input
                    type="text"
                    placeholder="Field Name"
                    value={field.name}
                    onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                    className={styles['custom-field-input-grow']}
                  />
                  <Input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                    className={styles['custom-field-input-grow']}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(field.id)}
                    className={styles['remove-custom-field-btn']}
                    title="Remove field"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Priority Weight Number Selection */}
      <div className={styles['field-group']}>
        <Input
          id="item-priority-input"
          label="Item Priority"
          type="number"
          min="1"
          placeholder="Enter priority (lowest e.g. 1 is highest priority)"
          value={priorityWeight}
          onChange={(e) => setPriorityWeight(e.target.value)}
          className={styles['priority-input-field']}
        />
        <span className={styles['priority-hint']}>
          Note: Lower numbers (e.g. 1) sort to the top.
        </span>
      </div>

      {/* Linked Items / Dependencies */}
      {wishlistItems && wishlistItems.filter(i => i.Id !== itemId).length > 0 && (
        <div className={styles['field-group']}>
          <label className={styles.label}>Linked Items / Dependencies</label>
          <div className={styles['description-row']}>
            <span className={styles['checkbox-subtext']} style={{ flex: 1, margin: 0 }}>
              Link this item to other gifts to warn viewers of dependencies and let them claim them together.
            </span>
            <button
              type="button"
              onClick={() => setIsLinkingModeActive(prev => !prev)}
              className={`${styles['dependency-box-btn']} ${isLinkingModeActive ? styles['dependency-box-active'] : ''}`}
              title={isLinkingModeActive ? 'Finish Selecting Items' : 'Select Items from Wishlist'}
              style={{ width: '56px', height: 'auto', alignSelf: 'stretch' }}
            >
              <Link size={16} />
              {linkedItemIds.length > 0 && (
                <span className={styles['dependency-badge']}>
                  {linkedItemIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {!isOwner && (
        <>
          <div className={styles['checkbox-wrapper']}>
            <label className={styles['checkbox-label']}>
              <input
                type="checkbox"
                checked={isHiddenIdea}
                onChange={(e) => setIsHiddenIdea(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles['checkbox-text']}>
                <strong>Suggest as Surprise Idea</strong>
                <span className={styles['checkbox-subtext']}>
                  This item will be hidden from the owner's view until their wishlist expires.
                </span>
              </span>
            </label>
          </div>

          <div className={styles['checkbox-wrapper']}>
            <label className={styles['checkbox-label']}>
              <input
                type="checkbox"
                checked={otherUsersCanSee}
                onChange={(e) => setOtherUsersCanSee(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles['checkbox-text']}>
                <strong>Visible to Other Collaborators</strong>
                <span className={styles['checkbox-subtext']}>
                  Allow other users to see this recommendation.
                </span>
              </span>
            </label>
          </div>

          {!isEdit && (
            <div className={styles['checkbox-wrapper']}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  checked={claimOnCreate}
                  onChange={(e) => setClaimOnCreate(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles['checkbox-text']}>
                  <strong>Claim this Item Immediately</strong>
                  <span className={styles['checkbox-subtext']}>
                    Mark this item as claimed by you as soon as it is created.
                  </span>
                </span>
              </label>
            </div>
          )}
        </>
      )}

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className={styles['submit-btn']}
      >
        {isEdit ? 'Save Changes' : 'Add Item'}
      </Button>
    </form>
  );
};
