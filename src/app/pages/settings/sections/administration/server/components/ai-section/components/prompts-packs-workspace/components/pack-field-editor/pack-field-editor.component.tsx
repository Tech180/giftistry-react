import React from 'react';
import type { PackFieldEditorProps } from './interfaces/props.interface';
import { PackFieldEditorTemplate } from './pack-field-editor.html';

export const PackFieldEditor: React.FC<PackFieldEditorProps> = (props) => {
  return <PackFieldEditorTemplate {...props} />;
};
