import React, { useRef } from 'react';
import { useItemsSession } from '../../../../providers/session';
import {
  COMPACT_COLUMN_KEYS,
  type CompactColumnKey,
} from '../../../../constants/compact-column-keys.constant';
import { useCompactColumnSync } from '../../../../hooks/use-compact-column-sync';
import { resolveCompactCategoryColumnPresence } from '../../../../utils/resolve-compact-category-column-presence.util';
import { CategoryListTemplate } from './category-list.html';
import type { Props } from './interfaces/props.interface';
import { itemSignature } from './utils/item-signature.util';
import styles from './category-list.module.css';

export const CategoryList: React.FC<Props> = ({
  items,
  allowGroupFunds,
  isTaggingModeActive,
  isOwner,
  currentUserId: currentUserIdProp,
  canShowTrailingActions = false,
  className,
  id,
  children,
}) => {
  const { user } = useItemsSession();
  const currentUserId = currentUserIdProp ?? user?.Id ?? null;
  const containerRef = useRef<HTMLDivElement>(null);

  const columnPresence = resolveCompactCategoryColumnPresence(items, {
    allowGroupFunds,
    isTaggingModeActive,
    isOwner,
    currentUserId,
    canShowTrailingActions,
  });

  const activeKeys: CompactColumnKey[] = [];
  for (const key of COMPACT_COLUMN_KEYS) {
    if (columnPresence[key]) {
      activeKeys.push(key);
    }
  }

  const columnWidthVars = useCompactColumnSync(containerRef, activeKeys, [
    itemSignature(items),
    isTaggingModeActive,
    allowGroupFunds,
    canShowTrailingActions,
  ]);

  const rootClassName = [styles['category-list'], className].filter(Boolean).join(' ');

  return (
    <CategoryListTemplate
      contextValue = {
        {
          columnPresence,
          isSyncEnabled: true,
        }
      }
      containerRef = {
        containerRef
      }
      id = {
        id
      }
      rootClassName = {
        rootClassName
      }
      style = {
        columnWidthVars
      }
      items = {
        items
      }
      children = {
        children
      }
    />
  );
};
