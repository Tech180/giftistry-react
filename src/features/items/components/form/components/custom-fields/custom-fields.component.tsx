import React, { useState } from 'react';
import type { Props } from './interfaces/props.interface';
import { CustomFieldsTemplate } from './custom-fields.html';

export const CustomFields: React.FC<Props> = (props) => {
  const [warningBadgeRevealed, setWarningBadgeRevealed] = useState(false);

  const isEditingCustomFieldName = (field: { id: string; name: string }) =>
    !field.name.trim() || props.editingCustomFieldNameId === field.id;

  return (
    <CustomFieldsTemplate
      {...props}
      warningBadgeRevealed={warningBadgeRevealed}
      onWarningBadgeReveal={setWarningBadgeRevealed}
      isEditingCustomFieldName={isEditingCustomFieldName}
    />
  );
};
