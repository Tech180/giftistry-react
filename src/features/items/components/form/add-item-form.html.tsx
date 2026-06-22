import React from 'react';
import { Tag, FileText, Link, Globe, DollarSign, Star, Plus, Trash2, Pin } from 'lucide-react';
import { Input, Button } from 'shared/ui';
import { AddItemFormTemplateProps } from '../../interfaces/add-item-form-template-props.interface';
import styles from './add-item-form.module.css';

const getFriendlyCategoryLabel = (id: string) => {
  const STANDARD_CATEGORIES = [
    { id: 'digital_tech', label: 'Digital & Tech' },
    { id: 'cash_funds', label: 'Cash Funds' },
    { id: 'home_kitchen', label: 'Home & Kitchen' },
    { id: 'baby_kids', label: 'Baby & Kids' },
    { id: 'apparel_accessories', label: 'Apparel & Accessories' },
    { id: 'health_wellness', label: 'Health & Wellness' },
    { id: 'outdoors_travel', label: 'Outdoors & Travel' },
    { id: 'hobbies_entertainment', label: 'Hobbies & Entertainment' },
  ];
  const found = STANDARD_CATEGORIES.find(c => c.id === id);
  if (found) return found.label;
  return id.split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

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
}) => {
  const showOptionalSizing = (category && category !== 'uncategorized') || hasScraped;
  const [varName, setVarName] = React.useState('');
  const [varQty, setVarQty] = React.useState<number | ''>(1);
  const [varError, setVarError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setVarError(null);
  }, [desiredQuantity, variations]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`}>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Link / URL & Website Name (First) */}
      <div className={styles.grid2Col}>
        <div className={styles.fieldGroup}>
          <Input
            label="Link / URL (Optional)"
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
                className={`${styles.scrapeButton} ${isScrapeButtonPulsing ? styles.pulseClickMe : ''
                  }`}
                title="Click to automatically fill item details"
              >
                <Link size={16} />
              </button>
            }
          />
          {isAutopopulating && (
            <div className={styles.autopopulateLoader}>
              <div className={styles.spinner} />
              <span>Fetching product details...</span>
            </div>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <Input
            label="Website Name (Optional)"
            type="text"
            placeholder="Amazon, Target"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            leftIcon={<Globe size={16} />}
          />
        </div>
      </div>

      {/* 2. Item Name & Price & Favorite */}
      <div className={styles.formRow}>
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
      <div className={styles.priceRow}>
        <div className={styles.priceInputWrapper} style={{ flex: 2 }}>
          <Input
            label="Price (Optional)"
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
        <div className={styles.priceInputWrapper} style={{ flex: 1 }}>
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
        <div className={styles.starWrapper}>
          <span className={styles.starLabel}>{isOwner ? 'Favorite' : 'Pin'}</span>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${styles.starToggleBtn} ${isOwner ? (isFavorite ? styles.starToggleBtnActive : '') : (isFavorite ? styles.pinToggleBtnActive : styles.pinToggleBtn)}`}
            title={isOwner ? (isFavorite ? 'Remove Favorite' : 'Mark as Favorite') : (isFavorite ? 'Unpin Item' : 'Pin Item')}
            style={{ height: '40px' }}
          >
            {isOwner ? (
              <Star
                size={18}
                fill={isFavorite ? '#f59e0b' : 'none'}
                stroke={isFavorite ? '#f59e0b' : 'currentColor'}
              />
            ) : (
              <Pin
                size={18}
                fill={isFavorite ? '#3b82f6' : 'none'}
                stroke={isFavorite ? '#3b82f6' : 'currentColor'}
                style={{ transform: isFavorite ? 'rotate(45deg)' : 'none' }}
              />
            )}
          </button>
        </div>
      </div>

      {typeof desiredQuantity === 'number' && desiredQuantity > 1 && (
        <div className={styles.checkboxWrapper} style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          <div className={styles.variationBoxQtyBadge}>
            {variations.reduce((sum, v) => sum + v.quantity, 0)}/{desiredQuantity}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} style={{ marginBottom: '8px', display: 'block' }}>Item Variations</label>
            {varError && (
              <div className={`${styles.alert} animate-slide-up`} style={{ marginBottom: '12px', marginTop: '4px' }}>
                <span>{varError}</span>
              </div>
            )}
            <div className={styles.variationInputRow}>
              <input
                type="text"
                placeholder="e.g. Red, Blue, Size M"
                value={varName}
                onChange={(e) => setVarName(e.target.value)}
                className={styles.variationNameInput}
              />
              <input
                type="number"
                min="1"
                value={varQty}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setVarQty('');
                  } else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) {
                      setVarQty(Math.max(1, num));
                    }
                  }
                }}
                className={styles.variationQtyInput}
                style={{ width: '60px' }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (varName.trim()) {
                    if (varQty === '') {
                      setVarError('Please enter a quantity for the variation.');
                      return;
                    }
                    const limit = Number(desiredQuantity) || 1;
                    const currentVarTotal = variations.reduce((sum, v) => sum + v.quantity, 0);
                    const remaining = limit - currentVarTotal;

                    if (remaining <= 0) {
                      setVarError('Cannot exceed the total quantity limit.');
                      return;
                    }

                    if (Number(varQty) > remaining) {
                      setVarError('Cannot exceed the total quantity limit.');
                      return;
                    }

                    setVarError(null);
                    setVariations(prev => [...prev, { name: varName.trim(), quantity: Number(varQty) }]);
                    setVarName('');
                    setVarQty(1);
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className={styles.variationsList}>
              {variations.map((v, idx) => (
                <span key={idx} className={styles.variationChip}>
                  {v.name} ({v.quantity})
                  <button
                    type="button"
                    onClick={() => setVariations(prev => prev.filter((_, i) => i !== idx))}
                    className={styles.removeVariationBtn}
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
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Gift Category (Optional)</label>
        <div className={styles.categoryChipsContainer}>
          {renderedCategories.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryChip} ${isSelected ? styles.categoryChipSelected : ''} ${cat.isCustom ? styles.categoryChipCustom : ''}`}
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
                    className={styles.deleteCategoryBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomCategory(cat.id);
                    }}
                    title="Delete Category"
                  >
                    &times;
                  </span>
                )}
              </button>
            );
          })}

          {isAddingCustom ? (
            <div className={`${styles.customCategoryInputWrapper} animate-slide-up`}>
              <input
                type="text"
                placeholder="Category name..."
                value={newCustomInput}
                onChange={(e) => setNewCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomCategory();
                  }
                }}
                className={styles.customCategoryInput}
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCustomCategory}
                className={styles.customCategoryAddBtn}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className={styles.customCategoryCancelBtn}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`${styles.categoryChip} ${styles.addCustomChip}`}
              onClick={() => {
                setIsAddingCustom(true);
                setNewCustomInput('');
              }}
            >
              + Custom
            </button>
          )}
        </div>
      </div>

      {/* 4. Description Section */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Description (Optional)</label>
        <div className={styles.textareaWrapper}>
          <span className={styles.textareaIcon}><FileText size={16} /></span>
          <textarea
            placeholder="Add details, size details, or notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.textarea}
            rows={3}
          />
        </div>
      </div>

      {/* Collapsible Optional & Custom Description Fields */}
      <div className={styles.extraFieldsToggleRow}>
        <button
          type="button"
          onClick={() => setShowExtraFields(!showExtraFields)}
          className={styles.extraFieldsToggleBtn}
        >
          <span>{showExtraFields ? 'Hide Custom Fields ▲' : 'Show Custom Fields ▼'}</span>
          {customFields.length > 0 && (
            <span className={styles.customFieldCountBubble}>
              {customFields.length}
            </span>
          )}
        </button>
      </div>

      {showExtraFields && (
        <div className={`${styles.extraFieldsPanel} animate-slide-up`}>
          {showOptionalSizing && (
            definitions.length > 0 ? (
              <>
                <h4 className={styles.panelTitle}>{getFriendlyCategoryLabel(category)} Sizing / Options</h4>
                <div className={styles.grid2Col}>
                  {definitions.filter(isFieldVisible).map((def) => (
                    <div key={def.Id} className={styles.fieldGroup}>
                      <label className={styles.panelLabel}>{def.Label}</label>
                      <input
                        type="text"
                        placeholder={def.Placeholder || ''}
                        value={dynamicValues[def.FieldKey] || ''}
                        onChange={(e) => handleUpdateDynamicValue(def.FieldKey, e.target.value)}
                        className={styles.panelInput}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h4 className={styles.panelTitle}>Clothing Sizes</h4>
                <div className={styles.grid2Col}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.panelLabel}>Pants Size</label>
                    <input
                      type="text"
                      placeholder="32x30"
                      value={pantsSize}
                      onChange={(e) => setPantsSize(e.target.value)}
                      className={styles.panelInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.panelLabel}>Shirt Size</label>
                    <input
                      type="text"
                      placeholder="Medium, 15.5"
                      value={shirtSize}
                      onChange={(e) => setShirtSize(e.target.value)}
                      className={styles.panelInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.panelLabel}>Shoes Size</label>
                    <input
                      type="text"
                      placeholder="10.5"
                      value={shoesSize}
                      onChange={(e) => setShoesSize(e.target.value)}
                      className={styles.panelInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.panelLabel}>Socks Size</label>
                    <input
                      type="text"
                      placeholder="9-11"
                      value={socksSize}
                      onChange={(e) => setSocksSize(e.target.value)}
                      className={styles.panelInput}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginTop: '8px' }}>
                  <label className={styles.panelLabel}>Preferred Color</label>
                  <input
                    type="text"
                    placeholder="Navy Blue, Matte Black"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={styles.panelInput}
                  />
                </div>
              </>
            )
          )}

          <div className={styles.customFieldsSectionHeader}>
            <h4 className={styles.panelTitle} style={{ margin: 0, border: 'none', padding: 0 }}>Custom Fields</h4>
            <button
              type="button"
              onClick={handleAddCustomField}
              className={styles.addCustomFieldBtn}
            >
              <Plus size={12} /> Add Field
            </button>
          </div>

          {customFields.length === 0 ? (
            <p className={styles.noCustomFieldsText}>No custom fields added yet.</p>
          ) : (
            <div className={styles.customFieldsList}>
              {customFields.map((field) => (
                <div key={field.id} className={styles.customFieldRow}>
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={field.name}
                    onChange={(e) => handleUpdateCustomField(field.id, 'name', e.target.value)}
                    className={styles.customFieldInput}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleUpdateCustomField(field.id, 'value', e.target.value)}
                    className={styles.customFieldInput}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(field.id)}
                    className={styles.removeCustomFieldBtn}
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
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="item-priority-input">Item Priority (Optional)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            id="item-priority-input"
            type="number"
            min="1"
            placeholder="Enter priority (lowest e.g. 1 is highest priority)"
            value={priorityWeight}
            onChange={(e) => setPriorityWeight(e.target.value)}
            className={styles.inlineInputFull}
            style={{ maxWidth: '300px' }}
          />
          <span style={{ fontSize: '0.85rem', color: '#666' }}>
            Note: Lower numbers (e.g. 1) sort to the top.
          </span>
        </div>
      </div>

      {/* Linked Items / Dependencies */}
      {wishlistItems && wishlistItems.filter(i => i.Id !== itemId).length > 0 && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Linked Items / Dependencies</label>
          <div className={styles.descriptionRow}>
            <span className={styles.checkboxSubtext} style={{ flex: 1, margin: 0 }}>
              Link this item to other gifts to warn viewers of dependencies and let them claim them together.
            </span>
            <button
              type="button"
              onClick={() => setIsLinkingModeActive(prev => !prev)}
              className={`${styles.dependencyBoxBtn} ${isLinkingModeActive ? styles.dependencyBoxActive : ''}`}
              title={isLinkingModeActive ? 'Finish Selecting Items' : 'Select Items from Wishlist'}
              style={{ width: '56px', height: 'auto', alignSelf: 'stretch' }}
            >
              <Link size={16} />
              {linkedItemIds.length > 0 && (
                <span className={styles.dependencyBadge}>
                  {linkedItemIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {!isOwner && (
        <>
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

          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={otherUsersCanSee}
                onChange={(e) => setOtherUsersCanSee(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                <strong>Visible to Other Collaborators</strong>
                <span className={styles.checkboxSubtext}>
                  Allow other users to see this recommendation.
                </span>
              </span>
            </label>
          </div>

          {!isEdit && (
            <div className={styles.checkboxWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={claimOnCreate}
                  onChange={(e) => setClaimOnCreate(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  <strong>Claim this Item Immediately</strong>
                  <span className={styles.checkboxSubtext}>
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
        className={styles.submitBtn}
      >
        {isEdit ? 'Save Changes' : 'Add Item'}
      </Button>
    </form>
  );
};
