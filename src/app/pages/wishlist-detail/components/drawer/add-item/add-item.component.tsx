import React, { useState, useEffect } from 'react';
import { AddItemProps } from './interfaces/add-item-props.interface';
import { AddItemTemplate } from './add-item.html';
import { useAuth } from 'app/providers/auth-context';

export const AddItem: React.FC<AddItemProps> = (props) => {
  const { canShowAi } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(true);

  useEffect(() => {
    setIsFormDirty(!props.editingItem && !props.viewingItem);
  }, [props.editingItem, props.viewingItem]);

  return (
    <AddItemTemplate
      {...props}
      canShowAi={canShowAi}
      isLoading={isLoading}
      isFormDirty={isFormDirty}
      onFormLoadingChange={setIsLoading}
      onFormDirtyChange={setIsFormDirty}
    />
  );
};
