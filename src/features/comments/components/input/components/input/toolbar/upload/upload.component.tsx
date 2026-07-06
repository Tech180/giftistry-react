import React, { useRef } from 'react';
import {
  COMMENT_ATTACHMENT_ALLOWED_TYPES,
  COMMENT_ATTACHMENT_MAX_BYTES,
  COMMENT_ATTACHMENT_SIZE_ERROR,
  COMMENT_ATTACHMENT_TYPE_ERROR,
} from '../../../../../../constants/comment-attachment';
import { UploadProps } from './interfaces/upload-props.interface';
import { UploadTemplate } from './upload.html';

export const ImageUploadButton: React.FC<UploadProps> = ({ onUpload, onError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > COMMENT_ATTACHMENT_MAX_BYTES) {
      onError(COMMENT_ATTACHMENT_SIZE_ERROR);
      return;
    }

    if (!(COMMENT_ATTACHMENT_ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      onError(COMMENT_ATTACHMENT_TYPE_ERROR);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onUpload(result);
    };
    reader.onerror = () => onError('Failed to read file.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <UploadTemplate
      onUpload={onUpload}
      onError={onError}
      fileInputRef={fileInputRef}
      onFileChange={handleFileChange}
      onButtonClick={() => fileInputRef.current?.click()}
    />
  );
};
