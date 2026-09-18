import React from 'react';
import { Gift, Search } from 'lucide-react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import type { WishlistSearchTemplateProps } from './interfaces/wishlist-search-template-props.interface';
import styles from './wishlist-search.module.css';

export const WishlistSearchTemplate: React.FC<WishlistSearchTemplateProps> = ({
  searchRef,
  searchInputRef,
  searchQuery,
  isSearchOpen,
  isSearchLoading,
  results,
  onQueryChange,
  onFocus,
  onClear,
}) => (
  <div className={styles['search-container']} ref={searchRef}>
    <div className={styles['search-input-wrapper']}>
      <Search size={14} className={styles['search-icon']} />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search wishlists... (⌘K)"
        className={styles['search-input']}
        value={searchQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
      />
      {searchQuery && (
        <button
          type="button"
          className={styles['clear-search-btn']}
          onClick={onClear}
          title="Clear search"
        >
          &times;
        </button>
      )}
    </div>

    {isSearchOpen && (
      <EnterPanel animation="dropdown" className={styles['search-dropdown']}>
        {isSearchLoading ? (
          <div className={styles['dropdown-status']}>Loading wishlists...</div>
        ) : results.length > 0 ? (
          <div className={styles['dropdown-list']}>
            {results.map(({ wishlist, isActive, onSelect, onHover }) => (
              <div
                key={wishlist.Id}
                className={`${styles['dropdown-item']} ${isActive ? styles['active-dropdown-item'] : ''}`}
                onClick={onSelect}
                onMouseEnter={onHover}
              >
                <Gift size={14} className={styles['dropdown-item-icon']} />
                <div className={styles['dropdown-item-info']}>
                  <span className={styles['dropdown-item-title']}>{wishlist.Title}</span>
                  {wishlist.OwnerUsername && (
                    <span className={styles['dropdown-item-owner']}>
                      @{wishlist.OwnerUsername}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery.trim() !== '' ? (
          <div className={styles['dropdown-status']}>
            No wishlists found matching "{searchQuery}"
          </div>
        ) : (
          <div className={styles['dropdown-status']}>Type to search your wishlists...</div>
        )}
      </EnterPanel>
    )}
  </div>
);
