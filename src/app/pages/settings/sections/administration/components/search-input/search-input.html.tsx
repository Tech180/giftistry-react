import React from 'react';
import { Search } from 'lucide-react';
import { SearchInputTemplateProps } from './interfaces/search-input-template-props.interface';
import styles from './search-input.module.css';

export const SearchInputTemplate: React.FC<SearchInputTemplateProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => (
  <div className={`${styles['search-wrapper']} ${className}`.trim()}>
    <Search className={styles['search-icon']} aria-hidden />
    <input
      className={styles['search-input']}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
