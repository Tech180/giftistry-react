import React from 'react';
import { Navigate } from 'react-router-dom';
import type { TemplateProps } from './interfaces/template-props.interface';

export const LegacyProfileRedirectTemplate: React.FC<TemplateProps> = ({
  pathname,
  search,
  hash,
}) => {
  return (
    <Navigate
      to = {
        {
          pathname,
          search,
          hash,
        }
      }
      replace
    />
  );
};
