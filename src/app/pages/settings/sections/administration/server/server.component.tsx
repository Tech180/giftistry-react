import React from 'react';
import { ServerTemplate } from './page.html';
import type { ServerProps } from './interfaces/props.interface';
import { usePage } from './hooks/use-page';

export const Server: React.FC<ServerProps> = (props) => {
  const templateProps = usePage(props);
  return <ServerTemplate {...templateProps} />;
};

export default Server;
