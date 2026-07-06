import React from 'react';
import { AttachmentProps } from './interfaces/attachment-props.interface';
import { AttachmentTemplate } from './attachment.html';

export const AttachmentPreview: React.FC<AttachmentProps> = (props) => (
  <AttachmentTemplate {...props} />
);
