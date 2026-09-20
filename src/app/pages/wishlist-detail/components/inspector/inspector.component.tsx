import React from 'react';
import { getCategoryMeta } from 'features/items';
import type { ItemShowcaseProps } from 'features/items';
import type { Props } from './interfaces/props.interface';
import { InspectorTemplate } from './inspector.html';

export const Inspector: React.FC<Props> = (props) => {
  const {
    selectedItem,
    selectedItemPriorityLabel,
    setSelectedItemId,
    isLocked,
    canCollaborate,
    openItemEditor,
    openClaimerSubstitutionCreate,
    openClaimerSubstitutionEdit,
    deleteClaimerSubstitution,
    openSubstitutionEdit,
    deleteSubstitutionOption,
  } = props;

  let showcaseProps: ItemShowcaseProps | null = null;
  let categoryLabel: string | null = null;
  let CategoryIcon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }> | null = null;

  if (selectedItem) {
    const categoryMeta = getCategoryMeta(selectedItem.Category);
    categoryLabel = categoryMeta.label;
    CategoryIcon = categoryMeta.icon;

    showcaseProps = {
      item: selectedItem,
      priorityLabel: selectedItemPriorityLabel,
      isOwner: props.isOwner,
      isExpired: props.isExpired,
      isArchived: props.isArchived,
      canCollaborate: canCollaborate && !isLocked,
      isPublicGuest: props.isPublicGuest,
      allowGroupFunds: props.wishlist.AllowGroupFunds,
      itemActions: props.itemActions,
      onEdit: isLocked ? undefined : () => openItemEditor(selectedItem),
      onAddSubstitution: isLocked || canCollaborate ? undefined : () => openClaimerSubstitutionCreate(selectedItem),
      onEditSubstitution: isLocked || canCollaborate ? undefined : () => openClaimerSubstitutionEdit(selectedItem),
      onDeleteSubstitution: isLocked || canCollaborate ? undefined : () => deleteClaimerSubstitution(selectedItem),
      onEditSubstitutionOption: isLocked ? undefined : (option) => openSubstitutionEdit(selectedItem, option.Id),
      onDeleteSubstitutionOption: isLocked ? undefined : (option) => deleteSubstitutionOption(option.Id),
      onClose: () => setSelectedItemId(null),
      wishlistItems: props.items,
      aiEnabled: props.wishlist.AiEnabled,
      variant: 'inline',
      onLinkedItemNavigate: props.handleItemTaggedClick,
      onLinkedItemsUnsupported: props.onLinkedItemsUnsupported,
    };
  }

  return (
    <InspectorTemplate
      {...props}
      showcaseProps = {
        showcaseProps
      }
      categoryLabel = {
        categoryLabel
      }
      CategoryIcon = {
        CategoryIcon
      }
    />
  );
};
