import React from 'react';
import { Navigate } from 'react-router-dom';
import type { TemplateProps } from './interfaces/template-props.interface';

export const RootRedirectTemplate: React.FC<TemplateProps> = ({ to }) => {
  return (
    <Navigate
      to = {
        to
      }
      replace
    />
  );
};
