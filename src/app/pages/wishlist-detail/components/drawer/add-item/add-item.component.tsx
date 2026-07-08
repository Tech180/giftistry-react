import React, { useState, useEffect } from 'react';
import { AddItemProps } from './interfaces/add-item-props.interface';
import { AddItemTemplate } from './add-item.html';

export const AddItem: React.FC<AddItemProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(true);

  useEffect(() => {
    setIsFormDirty(!props.editingItem);
  }, [props.editingItem]);

  return (
    <AddItemTemplate
      {...props}
      isLoading={isLoading}
      isFormDirty={isFormDirty}
      onFormLoadingChange={setIsLoading}
      onFormDirtyChange={setIsFormDirty}
    />
  );
};
