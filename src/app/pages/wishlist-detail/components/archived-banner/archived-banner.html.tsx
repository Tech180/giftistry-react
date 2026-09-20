import React from 'react';
import { Archive } from 'lucide-react';
import styles from './archived-banner.module.css';

export const ArchivedBannerTemplate: React.FC = () => (
  <p
    className = {
      styles['archived-banner']
    }
    role = {
      'status'
    }
    aria-label = {
      'Archived'
    }
  >
    <Archive
      size = {
        14
      }
      aria-hidden = {
        true
      }
    />
    <span>Archived</span>
    <Archive
      size = {
        14
      }
      aria-hidden = {
        true
      }
    />
  </p>
);
