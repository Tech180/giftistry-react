import React, { useState } from 'react';
import { AddItemProps } from './interfaces/add-item-props.interface';
import { AddItemTemplate } from './add-item.html';

export const AddItem: React.FC<AddItemProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AddItemTemplate
      {...props}
      isLoading={isLoading}
      onFormLoadingChange={setIsLoading}
    />
  );
};
