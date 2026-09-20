import { useState } from 'react';
import { getFriendlyCategoryLabel } from '../../../utils/category-label.util';
import { STANDARD_CATEGORIES } from '../../../constants/standard-categories';
import type { UseCategoriesResult } from '../interfaces/use-categories-result.interface';

export function useCategories(options: {
  existingCategories: string[];
  category: string;
  setCategory: (val: string) => void;
  canShowAi: boolean;
}): UseCategoriesResult {
  const { existingCategories, category, setCategory, canShowAi } = options;

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomInput, setNewCustomInput] = useState('');
  const [sessionCustomCategories, setSessionCustomCategories] = useState<string[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<string[]>([]);
  const [aiCategoryPrimary, setAiCategoryPrimary] = useState<string | null>(null);
  const [aiCategoryAlternatives, setAiCategoryAlternatives] = useState<string[]>([]);

  const listCategorySet = new Set(
    (existingCategories ?? []).filter(
      (cat): cat is string => !!cat && cat !== 'uncategorized'
    )
  );

  const renderedCategories: {
    id: string;
    label: string;
    isCustom?: boolean;
    isFromList?: boolean;
  }[] = [];

  STANDARD_CATEGORIES.forEach((c) => {
    renderedCategories.push({
      ...c,
      isCustom: false,
      isFromList: listCategorySet.has(c.id),
    });
  });

  listCategorySet.forEach((cat) => {
    if (
      !STANDARD_CATEGORIES.some((s) => s.id === cat) &&
      !renderedCategories.some((r) => r.id === cat) &&
      !deletedCategories.includes(cat)
    ) {
      renderedCategories.push({
        id: cat,
        label: getFriendlyCategoryLabel(cat),
        isCustom: true,
        isFromList: true,
      });
    }
  });

  sessionCustomCategories.forEach((cat) => {
    if (cat && !renderedCategories.some((r) => r.id === cat) && !deletedCategories.includes(cat)) {
      renderedCategories.push({
        id: cat,
        label: getFriendlyCategoryLabel(cat),
        isCustom: true,
        isFromList: listCategorySet.has(cat),
      });
    }
  });

  if (
    category &&
    category !== 'uncategorized' &&
    !renderedCategories.some((r) => r.id === category) &&
    !deletedCategories.includes(category)
  ) {
    renderedCategories.push({
      id: category,
      label: getFriendlyCategoryLabel(category),
      isCustom: true,
      isFromList: listCategorySet.has(category),
    });
  }

  const aiCategoryIds = new Set<string>();
  if (aiCategoryPrimary && aiCategoryPrimary !== 'uncategorized') {
    aiCategoryIds.add(aiCategoryPrimary);
  }
  aiCategoryAlternatives.forEach((alt) => {
    if (alt && alt !== 'uncategorized') {
      aiCategoryIds.add(alt);
    }
  });

  const aiCategoryChips: Array<{ id: string; label: string; variant: 'primary' | 'suggestion' }> =
    [];
  if (canShowAi && aiCategoryIds.size > 0) {
    if (aiCategoryPrimary && aiCategoryPrimary !== 'uncategorized') {
      aiCategoryChips.push({
        id: aiCategoryPrimary,
        label: getFriendlyCategoryLabel(aiCategoryPrimary),
        variant: 'primary',
      });
    }
    aiCategoryAlternatives.forEach((alt) => {
      if (!alt || alt === 'uncategorized' || alt === aiCategoryPrimary) {
        return;
      }
      if (aiCategoryChips.some((chip) => chip.id === alt)) {
        return;
      }
      aiCategoryChips.push({
        id: alt,
        label: getFriendlyCategoryLabel(alt),
        variant: 'suggestion',
      });
    });
  }

  const handleAddCustomCategory = () => {
    const val = newCustomInput.trim();
    if (!val) {
      return;
    }

    if (deletedCategories.includes(val)) {
      setDeletedCategories((prev) => prev.filter((c) => c !== val));
    }
    if (!sessionCustomCategories.includes(val)) {
      setSessionCustomCategories((prev) => [...prev, val]);
    }
    setCategory(val);
    setIsAddingCustom(false);
    setNewCustomInput('');
  };

  const handleDeleteCustomCategory = (catId: string) => {
    setDeletedCategories((prev) => [...prev, catId]);
    setSessionCustomCategories((prev) => prev.filter((c) => c !== catId));
    if (category === catId) {
      setCategory('uncategorized');
    }
  };

  const clearAiCategories = () => {
    setAiCategoryPrimary(null);
    setAiCategoryAlternatives([]);
  };

  return {
    isAddingCustom,
    setIsAddingCustom,
    newCustomInput,
    setNewCustomInput,
    sessionCustomCategories,
    setSessionCustomCategories,
    deletedCategories,
    setDeletedCategories,
    aiCategoryPrimary,
    setAiCategoryPrimary,
    aiCategoryAlternatives,
    setAiCategoryAlternatives,
    renderedCategories,
    aiCategoryIds,
    aiCategoryChips,
    handleAddCustomCategory,
    handleDeleteCustomCategory,
    clearAiCategories,
  };
}
