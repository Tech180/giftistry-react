import React from 'react';
import { TabBarProps } from './interfaces/tab-bar-props.interface';
import { TabBarTemplate } from './tab-bar.html';

export const TabBar: React.FC<TabBarProps> = (props) => {
  return <TabBarTemplate {...props} />;
};
