import React from 'react';
import type { DbSectionProps } from './interfaces/props.interface';
import { DbSectionTemplate } from './db-section.html';

export const DbSection: React.FC<DbSectionProps> = (props) => {
  return <DbSectionTemplate {...props} />;
};
export default DbSection;
