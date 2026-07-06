import React from 'react';

export interface CommentInputTemplateProps {
  handleSubmit: (e: React.SyntheticEvent) => void;
  typingIndicator: React.ReactNode;
  ownerWarning: React.ReactNode;
  uploadErrorBar: React.ReactNode;
  metaRow: React.ReactNode;
  attachmentPreview: React.ReactNode;
  editor: React.ReactNode;
  toolbar: React.ReactNode;
  footer: React.ReactNode;
}
