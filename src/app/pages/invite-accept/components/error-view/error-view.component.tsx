import React from 'react';
import type { ErrorViewProps } from './interfaces/error-view-props.interface';
import { ErrorViewTemplate } from './error-view.html';

export const ErrorView: React.FC<ErrorViewProps> = (props) => <ErrorViewTemplate {...props} />;
