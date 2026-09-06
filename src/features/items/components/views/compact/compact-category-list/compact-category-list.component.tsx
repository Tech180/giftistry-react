import React, { useMemo, useRef } from 'react';
import { useAuth } from 'app/providers/auth-context';
import {
  COMPACT_COLUMN_KEYS,
  type CompactColumnKey,
} from '../../../../constants/compact-column-keys.constant';
import { useCompactColumnSync } from '../../../../hooks/use-compact-column-sync';
import { resolveCompactCategoryColumnPresence } from '../../../../utils/resolve-compact-category-column-presence.util';
import {
  CompactColumnSyncContext,
} from './compact-column-sync.context';
import type { CompactCategoryListProps } from './interfaces/compact-category-list-props.interface';
import styles from './compact-category-list.module.css';

export const CompactCategoryList: React.FC<CompactCategoryListProps> = ({
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
  const { user } = useAuth();
  const currentUserId = currentUserIdProp ?? user?.Id ?? null;
  const containerRef = useRef<HTMLDivElement>(null);

  const columnPresence = useMemo(
    () =>
      resolveCompactCategoryColumnPresence(items, {
        allowGroupFunds,
        isTaggingModeActive,
        isOwner,
        currentUserId,
        canShowTrailingActions,
      }),
    [
      items,
      allowGroupFunds,
      isTaggingModeActive,
      isOwner,
      currentUserId,
      canShowTrailingActions,
    ]
  );

  const activeKeys = useMemo(() => {
    const keys: CompactColumnKey[] = [];
    for (const key of COMPACT_COLUMN_KEYS) {
      if (columnPresence[key]) {
        keys.push(key);
      }
    }
    return keys;
  }, [columnPresence]);

  const itemSignature = useMemo(
    () =>
      items
        .map((item) => {
          const subFundingSignal = (item.SubstitutionOptions ?? [])
            .map(
              (option) =>
                `${option.Item.Id}:${option.Item.TotalClaimedAmount ?? ''}:${option.Item.Claims?.length ?? 0}`
            )
            .join(',');
          return [
            item.Id,
            item.Priority ?? '',
            item.IsSuggestion ? 1 : 0,
            item.Claims.length,
            item.Links.length,
            item.DesiredQuantity ?? '',
            item.SharedWith?.length ?? 0,
            item.FundingTarget ?? '',
            item.TotalClaimedAmount ?? '',
            subFundingSignal,
          ].join(':');
        })
        .join('|'),
    [items]
  );

  const columnWidthVars = useCompactColumnSync(containerRef, activeKeys, [
    itemSignature,
    isTaggingModeActive,
    allowGroupFunds,
    canShowTrailingActions,
  ]);

  const contextValue = useMemo(
    () => ({
      columnPresence,
      isSyncEnabled: true,
    }),
    [columnPresence]
  );

  return (
    <CompactColumnSyncContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        id={id}
        className={`${styles['compact-category-list']} ${className ?? ''}`.trim()}
        style={columnWidthVars}
      >
        {items.map((item) => children(item))}
      </div>
    </CompactColumnSyncContext.Provider>
  );
};
