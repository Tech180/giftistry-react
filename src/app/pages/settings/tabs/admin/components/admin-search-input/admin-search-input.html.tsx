import React from 'react';
import { Search } from 'lucide-react';
import { AdminSearchInputTemplateProps } from './interfaces/admin-search-input-template-props.interface';
import styles from './admin-search-input.module.css';

export const AdminSearchInputTemplate: React.FC<AdminSearchInputTemplateProps> = ({
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
