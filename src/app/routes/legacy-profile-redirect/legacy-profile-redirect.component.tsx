import React from 'react';
import { useLocation } from 'react-router-dom';
import { LegacyProfileRedirectTemplate } from './legacy-profile-redirect.html';
import { legacyProfilePath } from './utils/legacy-profile-path.util';

export function LegacyProfileRedirect() {
  const location = useLocation();
  const target = legacyProfilePath(location.pathname);

  return (
    <LegacyProfileRedirectTemplate
      pathname = {
        target
      }
      search = {
        location.search
      }
      hash = {
        location.hash
      }
    />
  );
}
