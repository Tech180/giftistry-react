import React from 'react';
import { UploadErrorProps } from './interfaces/upload-error-props.interface';
import { UploadErrorTemplate } from './upload-error.html';

export const UploadErrorBar: React.FC<UploadErrorProps> = (props) => (
  <UploadErrorTemplate {...props} />
);
