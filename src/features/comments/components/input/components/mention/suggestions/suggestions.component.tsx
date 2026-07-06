import React from 'react';
import { SuggestionsProps } from './interfaces/suggestions-props.interface';
import { SuggestionsTemplate } from './suggestions.html';

export const MentionSuggestions: React.FC<SuggestionsProps> = (props) => (
  <SuggestionsTemplate {...props} />
);
