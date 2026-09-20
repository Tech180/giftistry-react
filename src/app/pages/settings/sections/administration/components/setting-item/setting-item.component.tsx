import React from 'react';
import { SettingItemTemplate } from './setting-item.html';
import { SettingItemProps } from './interfaces/setting-item-props.interface';

export const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  children,
  layout = 'row',
  className,
}) => (
  <SettingItemTemplate title={title} description={description} layout={layout} className={className}>
    {children}
  </SettingItemTemplate>
);
