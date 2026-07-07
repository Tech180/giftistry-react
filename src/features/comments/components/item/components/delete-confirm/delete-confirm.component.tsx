import React from 'react';
import { DeleteConfirmProps } from './interfaces/delete-confirm-props.interface';
import { DeleteConfirmTemplate } from './delete-confirm.html';

export const DeleteConfirm: React.FC<DeleteConfirmProps> = (props) => {
  return <DeleteConfirmTemplate {...props} />;
};
