import React from 'react';
import { usePage } from './hooks/use-page';
import { PageTemplate } from './page.html';

export default function InviteAcceptPage() {
  const templateProps = usePage();
  return <PageTemplate {...templateProps} />;
}
