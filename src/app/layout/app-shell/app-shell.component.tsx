import React from 'react';
import { AppShellTemplate } from './app-shell.html';
import { AppShellProps } from './interfaces/app-shell-props.interface';

export type { AppShellProps } from './interfaces/app-shell-props.interface';

export const AppShell: React.FC<AppShellProps> = (props) => {
  return <AppShellTemplate {...props} />;
};
