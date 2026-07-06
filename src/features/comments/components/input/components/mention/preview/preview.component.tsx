import React from 'react';
import { PreviewProps } from './interfaces/preview-props.interface';
import { PreviewTemplate } from './preview.html';

export const MentionPreview: React.FC<PreviewProps> = (props) => (
  <PreviewTemplate {...props} />
);
