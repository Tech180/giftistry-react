import React from 'react';
import { Eye, Globe, Lock } from 'lucide-react';
import type { Props } from './interfaces/props.interface';

export const AudienceIconTemplate: React.FC<Props> = ({ kind }) => {
  if (kind === 'everyone') {
    return <Globe size={12} aria-hidden />;
  }

  if (kind === 'only-me') {
    return <Lock size={12} aria-hidden />;
  }

  return <Eye size={12} aria-hidden />;
};
