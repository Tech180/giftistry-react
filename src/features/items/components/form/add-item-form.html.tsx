import React from 'react';
import { Tag, FileText, Link, Globe, DollarSign, Star, Plus, Trash2 } from 'lucide-react';
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
  priorityId,
  setPriorityId,
  isHiddenIdea,
  setIsHiddenIdea,
  priorities,
  isOwner,
  isLoading,
  errorMsg,
  handleSubmit,
  showNewPriorityForm,
  setShowNewPriorityForm,
  newPriorityLabel,
  setNewPriorityLabel,
  newPriorityWeight,
  setNewPriorityWeight,
  newPriorityLoading,
  handleCreatePriority,
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
  handleDeletePriority,
}) => {
  const showOptionalSizing = (category && category !== 'uncategorized') || hasScraped;

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
        <div className={styles.priceInputWrapper}>
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
        <div className={styles.starWrapper}>
          <span className={styles.starLabel}>Favorite</span>
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`${styles.starToggleBtn} ${isFavorite ? styles.starToggleBtnActive : ''}`}
            title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
            style={{ height: '40px' }}
          >
            <Star
              size={18}
              fill={isFavorite ? '#f59e0b' : 'none'}
              stroke={isFavorite ? '#f59e0b' : 'currentColor'}
            />
          </button>
        </div>
      </div>

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

      {/* 5. Priority / Category Section */}
      <div className={styles.fieldGroup}>
        <div className={styles.priorityLabelRow}>
          <label className={styles.label}>Category / Section (Optional)</label>
          <button
            type="button"
            onClick={() => setShowNewPriorityForm(!showNewPriorityForm)}
            className={styles.inlineFormToggle}
          >
            {showNewPriorityForm ? 'Cancel New' : '+ New Category'}
          </button>
        </div>

        {showNewPriorityForm ? (
          <div className={styles.inlinePriorityForm}>
            <div className={styles.inlineInputs}>
              <input
                placeholder="Category (Starred, Expensive, Common)"
                value={newPriorityLabel}
                onChange={(e) => setNewPriorityLabel(e.target.value)}
                className={styles.inlineInput}
              />
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Weight (1-10)"
                value={newPriorityWeight}
                onChange={(e) => setNewPriorityWeight(e.target.value)}
                className={styles.inlineWeightInput}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCreatePriority}
                isLoading={newPriorityLoading}
                className={styles.inlineCreateBtn}
              >
                Create
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.categoryChipsContainer}>
            <button
              type="button"
              className={`${styles.categoryChip} ${priorityId === '' ? styles.categoryChipSelected : ''}`}
              onClick={() => setPriorityId('')}
            >
              General Gifts
            </button>
            {priorities.map((p) => {
              const isSelected = priorityId === p.Id;
              return (
                <div
                  key={p.Id}
                  className={`${styles.categoryChip} ${isSelected ? styles.categoryChipSelected : ''}`}
                  onClick={() => setPriorityId(p.Id)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <span>{p.Label}</span>
                  <span
                    className={styles.deleteCategoryBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePriority(p.Id);
                    }}
                    title="Delete Category"
                  >
                    &times;
                  </span>
                </div>
              );
            })}
          </div>
        )}
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
        {isEdit ? 'Save Changes' : 'Add Item'}
      </Button>
    </form>
  );
};
