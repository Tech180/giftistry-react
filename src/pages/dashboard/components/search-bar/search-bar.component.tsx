import React from 'react';
import { SearchBarProps } from './interfaces/search-bar-props.interface';
import { SearchBarTemplate } from './search-bar.html';

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  return <SearchBarTemplate {...props} />;
};
