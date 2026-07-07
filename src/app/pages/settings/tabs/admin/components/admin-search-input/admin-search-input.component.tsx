import React from 'react';
import { AdminSearchInputTemplate } from './admin-search-input.html';
import { AdminSearchInputProps } from './interfaces/admin-search-input-props.interface';

export const AdminSearchInput: React.FC<AdminSearchInputProps> = (props) => (
  <AdminSearchInputTemplate {...props} />
);
