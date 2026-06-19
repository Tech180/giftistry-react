import React, { useState, useEffect } from 'react';
import { itemsApi, FieldDefinition } from '../../api/items.api';
import { Priority, wishlistsApi } from 'features/wishlists';
import { AddItemFormProps } from '../../interfaces/add-item-form-props.interface';
import { AddItemFormTemplate } from './add-item-form.html';

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

const getFriendlyLabel = (id: string) => {
  const found = STANDARD_CATEGORIES.find(c => c.id === id);
  if (found) return found.label;
  return id.split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const AddItemForm: React.FC<AddItemFormProps> = ({ listId, isOwner, onSuccess, existingCategories = [], item }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [isHiddenIdea, setIsHiddenIdea] = useState(false);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  const [linkUrl, setLinkUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [price, setPrice] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAutopopulating, setIsAutopopulating] = useState(false);
  const [hasScraped, setHasScraped] = useState(false);

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomInput, setNewCustomInput] = useState('');
  const [sessionCustomCategories, setSessionCustomCategories] = useState<string[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<string[]>([]);

  // Optional and Custom Description Fields
  const [pantsSize, setPantsSize] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [shoesSize, setShoesSize] = useState('');
  const [socksSize, setSocksSize] = useState('');
  const [color, setColor] = useState('');
  const [customFields, setCustomFields] = useState<{ id: string; name: string; value: string }[]>([]);
  const [showExtraFields, setShowExtraFields] = useState(false);

  const [showNewPriorityForm, setShowNewPriorityForm] = useState(false);
  const [newPriorityLabel, setNewPriorityLabel] = useState('');
  const [newPriorityWeight, setNewPriorityWeight] = useState('5');
  const [newPriorityLoading, setNewPriorityLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic fields
  const [definitions, setDefinitions] = useState<FieldDefinition[]>([]);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});

  const mapCategoryForDefinitions = (cat: string): string => {
    const c = cat.toLowerCase();
    if (c === 'apparel_accessories' || c === 'clothing') return 'clothing';
    if (c === 'digital_tech' || c === 'tech') return 'tech';
    return c;
  };

  useEffect(() => {
    const fetchDefinitions = async () => {
      const mappedCat = mapCategoryForDefinitions(category);
      try {
        const res = await itemsApi.getFieldDefinitions(mappedCat);
        setDefinitions(res || []);
      } catch (err) {
        setDefinitions([]);
      }
    };
    if (category) {
      fetchDefinitions();
    } else {
      setDefinitions([]);
    }
  }, [category]);

  const isFieldVisible = (def: FieldDefinition) => {
    if (!def.Dependencies || def.Dependencies.length === 0) {
      return true;
    }
    return def.Dependencies.every(dep => {
      const triggerVal = dynamicValues[dep.TriggerFieldKey] || '';
      if (dep.TriggerValue === 'any') {
        return triggerVal.trim().length > 0;
      }
      return triggerVal.toLowerCase() === dep.TriggerValue.toLowerCase();
    });
  };

  const handleUpdateDynamicValue = (key: string, val: string) => {
    setDynamicValues(prev => ({
      ...prev,
      [key]: val
    }));
  };

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const data = await wishlistsApi.listPriorities(listId);
        setPriorities(data || []);
      } catch (err) {
        // Fallback silently if priority fetch fails
      }
    };
    fetchPriorities();
  }, [listId]);

  const handleDeletePriority = async (id: string) => {
    try {
      await wishlistsApi.deletePriority(id);
      setPriorities(prev => prev.filter(p => p.Id !== id));
      if (priorityId === id) {
        setPriorityId('');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  useEffect(() => {
    if (item) {
      setName(item.Name || '');
      
      // Parse description if it's JSON
      let parsedDesc = '';
      if (item.Description) {
        try {
          if (item.Description.startsWith('{') && item.Description.endsWith('}')) {
            const parsed = JSON.parse(item.Description);
            parsedDesc = parsed.text || '';
            
            const dynValues: Record<string, string> = {};
            for (const key of Object.keys(parsed)) {
              if (key !== 'text' && key !== 'custom') {
                dynValues[key] = String(parsed[key] || '');
              }
            }
            setDynamicValues(dynValues);

            setPantsSize(parsed.pantsSize || '');
            setShirtSize(parsed.shirtSize || '');
            setShoesSize(parsed.shoesSize || '');
            setSocksSize(parsed.socksSize || '');
            setColor(parsed.color || '');
            if (parsed.custom) {
              setCustomFields(parsed.custom.map((f: any) => ({ id: Math.random().toString(), name: f.name, value: f.value })));
            }
            setShowExtraFields(true);
          } else {
            parsedDesc = item.Description;
            setDynamicValues({});
          }
        } catch (_) {
          parsedDesc = item.Description;
          setDynamicValues({});
        }
      }
      setDescription(parsedDesc);
      setPriorityId(item.PriorityId || '');
      setIsHiddenIdea(item.IsHiddenIdea || false);
      setCategory(item.Category || 'uncategorized');
      
      // Pre-fill link if one is available
      if (item.Links && item.Links.length > 0) {
        setLinkUrl(item.Links[0].Url || '');
        setWebsiteName(item.Links[0].RetailerName || '');
        setPrice(item.Links[0].ExtractedPrice !== null ? item.Links[0].ExtractedPrice.toString() : '');
      } else {
        setLinkUrl('');
        setWebsiteName('');
        setPrice('');
      }
    } else {
      // Reset everything when item is null (Add Mode)
      setName('');
      setDescription('');
      setPriorityId('');
      setIsHiddenIdea(false);
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      setPantsSize('');
      setShirtSize('');
      setShoesSize('');
      setSocksSize('');
      setColor('');
      setCustomFields([]);
      setDynamicValues({});
      setShowExtraFields(false);
    }
  }, [item]);

  useEffect(() => {
    setHasScraped(false);
  }, [linkUrl]);

  const handleScrapeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    try {
      new URL(linkUrl.trim());
    } catch (_) {
      setErrorMsg('Please enter a valid URL.');
      return;
    }

    // Automatically pre-populate the Website Name from hostname if not manually typed yet
    try {
      const urlObj = new URL(linkUrl.trim());
      const hostname = urlObj.hostname;
      const retailerNameRaw = hostname.replace('www.', '').split('.')[0] || '';
      const extractedWebName = retailerNameRaw ? retailerNameRaw.charAt(0).toUpperCase() + retailerNameRaw.slice(1) : '';
      if (extractedWebName && !websiteName.trim()) {
        setWebsiteName(extractedWebName);
      }
    } catch (_) {}

    setIsAutopopulating(true);
    setErrorMsg(null);
    try {
      const data = await itemsApi.extractMetadata(linkUrl.trim());
      if (data) {
        setHasScraped(true);
        if (data.title && !name.trim()) {
          setName(data.title);
        }
        if (data.price !== null && data.price !== undefined && !price.trim()) {
          setPrice(data.price.toString());
        }
        if (data.description && !description.trim()) {
          setDescription(data.description);
        }
        if (data.category && (category === 'uncategorized' || !category)) {
          setCategory(data.category);
        }
        if (data.color && !color) {
          setColor(data.color);
          setShowExtraFields(true);
        }
        if (data.size && !pantsSize && !shirtSize && !shoesSize && !socksSize) {
          const sizeVal = data.size.trim();
          const urlLower = linkUrl.toLowerCase();
          const titleLower = (data.title || '').toLowerCase();

          if (urlLower.includes('shoe') || urlLower.includes('boot') || urlLower.includes('sneaker') || titleLower.includes('shoe') || titleLower.includes('sneaker')) {
            setShoesSize(sizeVal);
            setShowExtraFields(true);
          } else if (urlLower.includes('pant') || urlLower.includes('jeans') || urlLower.includes('trouser') || urlLower.includes('short') || titleLower.includes('pant') || titleLower.includes('jeans') || /^\d{2}x\d{2}$/i.test(sizeVal)) {
            setPantsSize(sizeVal);
            setShowExtraFields(true);
          } else if (urlLower.includes('sock') || titleLower.includes('sock')) {
            setSocksSize(sizeVal);
            setShowExtraFields(true);
          } else {
            setShirtSize(sizeVal);
            setShowExtraFields(true);
          }
        }
      }
    } catch (err) {
      setErrorMsg('Failed to fetch product details automatically. You can still enter them manually.');
    } finally {
      setIsAutopopulating(false);
    }
  };

  const handleAddCustomField = () => {
    setCustomFields(prev => [...prev, { id: Math.random().toString(), name: '', value: '' }]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateCustomField = (id: string, key: 'name' | 'value', value: string) => {
    setCustomFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleCreatePriority = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newPriorityLabel.trim()) return;

    setNewPriorityLoading(true);
    setErrorMsg(null);
    try {
      const weight = parseInt(newPriorityWeight, 10) || 5;
      const newPriority = await wishlistsApi.createPriority(newPriorityLabel.trim(), weight);
      setPriorities(prev => [...prev, newPriority]);
      setPriorityId(newPriority.Id);
      setNewPriorityLabel('');
      setNewPriorityWeight('5');
      setShowNewPriorityForm(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create priority.');
    } finally {
      setNewPriorityLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter an item name.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      let finalPriorityId = priorityId || null;

      if (isFavorite) {
        const favoritePriority = priorities.find(
          (p) => p.Label === 'Favorite' || p.Label === 'High' || p.Label.includes('★')
        );
        if (favoritePriority) {
          finalPriorityId = favoritePriority.Id;
        } else {
          try {
            const newPriority = await wishlistsApi.createPriority('★ Favorite', 10);
            setPriorities((prev) => [...prev, newPriority]);
            finalPriorityId = newPriority.Id;
          } catch (err) {
            // Ignore priority creation error
          }
        }
      }

      // Serialize optional and custom fields inside description as JSON if present
      let descPayload: string | null = null;

      const visibleDynamicValues: Record<string, string> = {};
      definitions.forEach(def => {
        if (isFieldVisible(def)) {
          const val = dynamicValues[def.FieldKey];
          if (val && val.trim()) {
            visibleDynamicValues[def.FieldKey] = val.trim();
          }
        }
      });

      const hasVisibleDynamic = Object.keys(visibleDynamicValues).length > 0;
      const hasExtraFields = pantsSize.trim() || shirtSize.trim() || shoesSize.trim() || socksSize.trim() || color.trim() || customFields.some(f => f.name.trim() && f.value.trim());

      if (hasVisibleDynamic || hasExtraFields || description.trim()) {
        if (hasVisibleDynamic || hasExtraFields) {
          descPayload = JSON.stringify({
            text: description.trim() || null,
            pantsSize: pantsSize.trim() || null,
            shirtSize: shirtSize.trim() || null,
            shoesSize: shoesSize.trim() || null,
            socksSize: socksSize.trim() || null,
            color: color.trim() || null,
            custom: customFields
              .filter(f => f.name.trim() && f.value.trim())
              .map(f => ({ name: f.name.trim(), value: f.value.trim() })),
            ...visibleDynamicValues
          });
        } else {
          descPayload = description.trim();
        }
      }

      if (item) {
        await itemsApi.updateItem(
          item.Id,
          name.trim(),
          descPayload,
          finalPriorityId,
          category === 'uncategorized' ? null : category
        );
      } else {
        await itemsApi.addItem(
          listId,
          name.trim(),
          descPayload,
          finalPriorityId,
          isOwner ? false : isHiddenIdea,
          linkUrl.trim() || null,
          price.trim() ? parseFloat(price) : null,
          websiteName.trim() || null,
          category === 'uncategorized' ? null : category
        );
      }

      // Reset all states
      setName('');
      setDescription('');
      setPriorityId('');
      setIsHiddenIdea(false);
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      setPantsSize('');
      setShirtSize('');
      setShoesSize('');
      setSocksSize('');
      setColor('');
      setCustomFields([]);
      setShowExtraFields(false);
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add item.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compile list of categories
  const renderedCategories: { id: string; label: string; isCustom?: boolean }[] = [];
  STANDARD_CATEGORIES.forEach(c => renderedCategories.push({ ...c, isCustom: false }));

  if (existingCategories) {
    existingCategories.forEach(cat => {
      if (cat && cat !== 'uncategorized' && !STANDARD_CATEGORIES.some(s => s.id === cat) && !renderedCategories.some(r => r.id === cat) && !deletedCategories.includes(cat)) {
        renderedCategories.push({ id: cat, label: getFriendlyLabel(cat), isCustom: true });
      }
    });
  }

  sessionCustomCategories.forEach(cat => {
    if (cat && !renderedCategories.some(r => r.id === cat) && !deletedCategories.includes(cat)) {
      renderedCategories.push({ id: cat, label: getFriendlyLabel(cat), isCustom: true });
    }
  });

  if (category && category !== 'uncategorized' && !renderedCategories.some(r => r.id === category) && !deletedCategories.includes(category)) {
    renderedCategories.push({ id: category, label: getFriendlyLabel(category), isCustom: true });
  }

  const handleAddCustomCategory = () => {
    const val = newCustomInput.trim();
    if (!val) return;

    if (deletedCategories.includes(val)) {
      setDeletedCategories(prev => prev.filter(c => c !== val));
    }
    if (!sessionCustomCategories.includes(val)) {
      setSessionCustomCategories(prev => [...prev, val]);
    }
    setCategory(val);
    setIsAddingCustom(false);
    setNewCustomInput('');
  };

  const handleDeleteCustomCategory = (catId: string) => {
    setDeletedCategories(prev => [...prev, catId]);
    setSessionCustomCategories(prev => prev.filter(c => c !== catId));
    if (category === catId) {
      setCategory('uncategorized');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.trim());
      return true;
    } catch (_) {
      return false;
    }
  };

  const isScrapeButtonPulsing = isValidUrl(linkUrl) && !hasScraped && !isAutopopulating;

  return (
    <AddItemFormTemplate
      name={name}
      setName={setName}
      description={description}
      setDescription={setDescription}
      priorityId={priorityId}
      setPriorityId={setPriorityId}
      isHiddenIdea={isHiddenIdea}
      setIsHiddenIdea={setIsHiddenIdea}
      priorities={priorities}
      isOwner={isOwner}
      isLoading={isLoading}
      errorMsg={errorMsg}
      handleSubmit={handleSubmit}
      showNewPriorityForm={showNewPriorityForm}
      setShowNewPriorityForm={setShowNewPriorityForm}
      newPriorityLabel={newPriorityLabel}
      setNewPriorityLabel={setNewPriorityLabel}
      newPriorityWeight={newPriorityWeight}
      setNewPriorityWeight={setNewPriorityWeight}
      newPriorityLoading={newPriorityLoading}
      handleCreatePriority={handleCreatePriority}
      linkUrl={linkUrl}
      setLinkUrl={setLinkUrl}
      websiteName={websiteName}
      setWebsiteName={setWebsiteName}
      category={category}
      setCategory={setCategory}
      price={price}
      setPrice={setPrice}
      isFavorite={isFavorite}
      setIsFavorite={setIsFavorite}
      isAutopopulating={isAutopopulating}
      hasScraped={hasScraped}
      handleScrapeClick={handleScrapeClick}
      pantsSize={pantsSize}
      setPantsSize={setPantsSize}
      shirtSize={shirtSize}
      setShirtSize={setShirtSize}
      shoesSize={shoesSize}
      setShoesSize={setShoesSize}
      socksSize={socksSize}
      setSocksSize={setSocksSize}
      color={color}
      setColor={setColor}
      customFields={customFields}
      handleAddCustomField={handleAddCustomField}
      handleRemoveCustomField={handleRemoveCustomField}
      handleUpdateCustomField={handleUpdateCustomField}
      showExtraFields={showExtraFields}
      setShowExtraFields={setShowExtraFields}
      renderedCategories={renderedCategories}
      isAddingCustom={isAddingCustom}
      setIsAddingCustom={setIsAddingCustom}
      newCustomInput={newCustomInput}
      setNewCustomInput={setNewCustomInput}
      handleDeleteCustomCategory={handleDeleteCustomCategory}
      handleAddCustomCategory={handleAddCustomCategory}
      isScrapeButtonPulsing={isScrapeButtonPulsing}
      isEdit={!!item}
      definitions={definitions}
      dynamicValues={dynamicValues}
      isFieldVisible={isFieldVisible}
      handleUpdateDynamicValue={handleUpdateDynamicValue}
      handleDeletePriority={handleDeletePriority}
    />
  );
};
