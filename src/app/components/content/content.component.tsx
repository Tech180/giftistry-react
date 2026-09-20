import React from 'react';
import { ContentTemplate } from './content.html';
import type { Props } from './interfaces/props.interface';

export const Content: React.FC<Props> = (props) => {
  return (
    <ContentTemplate
      isSettingsPage = {
        props.isSettingsPage
      }
      isFullWidth = {
        props.isFullWidth
      }
      isAuthPage = {
        props.isAuthPage
      }
    />
  );
};
