import React from 'react';
import { SettingGroupTemplateProps } from './interfaces/setting-group-template-props.interface';
import styles from './setting-group.module.css';

export const SettingGroupTemplate: React.FC<SettingGroupTemplateProps> = ({ children, className = '' }) => (
  <div className={`${styles['setting-group']} ${className}`.trim()}>{children}</div>
);
