import React from 'react';
import type { SectionProps } from '../interfaces/section-props.interface';
import { usePage } from './hooks/use-page';
import { PageTemplate } from './page.html';

export const Users: React.FC<SectionProps> = (props) => {
  const templateProps = usePage(props);
  return <PageTemplate {...templateProps} />;
};

export default Users;
