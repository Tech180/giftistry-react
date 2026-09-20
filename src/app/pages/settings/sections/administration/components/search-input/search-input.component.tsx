import React from 'react';
import { SearchInputTemplate } from './search-input.html';
import { SearchInputProps } from './interfaces/search-input-props.interface';

export const SearchInput: React.FC<SearchInputProps> = (props) => (
  <SearchInputTemplate {...props} />
);
