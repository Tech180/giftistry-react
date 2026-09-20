import React from 'react';
import { usePage } from './hooks/use-page';
import { PageTemplate } from './page.html';

export default function Settings() {
  const templateProps = usePage();
  return <PageTemplate {...templateProps} />;
}

export { Settings };
