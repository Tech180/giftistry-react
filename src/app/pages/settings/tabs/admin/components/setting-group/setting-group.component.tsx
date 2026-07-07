import React from 'react';
import { SettingGroupTemplate } from './setting-group.html';
import { SettingGroupProps } from './interfaces/setting-group-props.interface';

export const SettingGroup: React.FC<SettingGroupProps> = ({ children, className }) => (
  <SettingGroupTemplate className={className}>{children}</SettingGroupTemplate>
);
