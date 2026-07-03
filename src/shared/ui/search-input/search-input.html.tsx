import React from 'react';
import { Search } from 'lucide-react';
import { SearchInputTemplateProps } from './interfaces/search-input-template-props.interface';
import styles from './search-input.module.css';

export const SearchInputTemplate: React.FC<SearchInputTemplateProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  containerClass,
}) => {
  return (
    <div className={containerClass}>
      <span className={styles.icon} aria-hidden="true">
        <Search size={16} />
      </span>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
};
