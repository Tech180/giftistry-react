import React from 'react';
import { SearchInputProps } from './interfaces/search-input-props.interface';
import { SearchInputTemplate } from './search-input.html';
import styles from './search-input.module.css';

export type { SearchInputProps } from './interfaces/search-input-props.interface';

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
}) => {
  const containerClass = [styles.container, className].filter(Boolean).join(' ');

  return (
    <SearchInputTemplate
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      containerClass={containerClass}
    />
  );
};
