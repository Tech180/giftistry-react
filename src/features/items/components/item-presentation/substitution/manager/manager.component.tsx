import React, { useMemo, useState } from 'react';
import { MAX_OWNER_APPROVED_SUBSTITUTIONS } from '../../../../constants/substitution-messages.constant';
import type { ItemSubstitutionOption } from '../../../../interfaces/item-substitution.interface';
import type { SubstitutionManagerProps } from './interfaces/substitution-manager-props.interface';
import { SubstitutionManagerTemplate } from './manager.html';

export type { SubstitutionManagerProps } from './interfaces/substitution-manager-props.interface';

export const SubstitutionManager: React.FC<SubstitutionManagerProps> = ({
  parentItemId,
  options,
  allowSubstitutions,
  onAllowSubstitutionsChange,
  onOpenCreate,
  onOpenEdit,
  onDelete,
  onReorder,
  disabled = false,
}) => {
  const [busy, setBusy] = useState(false);

  const ownerOptions = useMemo(
    () =>
      [...options]
        .filter((o) => o.Kind === 'owner_approved')
        .sort((a, b) => a.SortOrder - b.SortOrder),
    [options]
  );

  const handleDelete = async (option: ItemSubstitutionOption) => {
    setBusy(true);
    try {
      await onDelete(option.Id);
    } finally {
      setBusy(false);
    }
  };

  const move = async (option: ItemSubstitutionOption, direction: -1 | 1) => {
    const index = ownerOptions.findIndex((o) => o.Id === option.Id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= ownerOptions.length) return;
    const next = [...ownerOptions];
    const [removed] = next.splice(index, 1);
    next.splice(target, 0, removed!);
    setBusy(true);
    try {
      await onReorder(next.map((o) => o.Id));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SubstitutionManagerTemplate
      allowSubstitutions={allowSubstitutions}
      onAllowSubstitutionsChange={onAllowSubstitutionsChange}
      ownerOptions={ownerOptions}
      canAddMore={ownerOptions.length < MAX_OWNER_APPROVED_SUBSTITUTIONS}
      disabled={disabled}
      hasParentItem={!!parentItemId}
      onAddClick={onOpenCreate}
      onEditClick={onOpenEdit}
      onDeleteClick={handleDelete}
      onMoveUp={(option) => move(option, -1)}
      onMoveDown={(option) => move(option, 1)}
      busy={busy}
    />
  );
};
