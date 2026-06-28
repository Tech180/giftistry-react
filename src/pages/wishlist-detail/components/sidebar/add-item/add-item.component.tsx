import React from 'react';
import { AddItemProps } from './interfaces/add-item-props.interface';
import { AddItemTemplate } from './add-item.html';

export const AddItem: React.FC<AddItemProps> = (props) => {
  return <AddItemTemplate {...props} />;
};
