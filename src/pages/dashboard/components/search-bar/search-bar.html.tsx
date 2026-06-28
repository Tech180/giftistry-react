import React from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from './interfaces/search-bar-props.interface';
import styles from './search-bar.module.css';

export const SearchBarTemplate: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className={styles.searchContainer}>
      <Search size={16} className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search wishlists..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
};
