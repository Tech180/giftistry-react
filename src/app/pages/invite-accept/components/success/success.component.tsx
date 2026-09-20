import React from 'react';
import type { SuccessProps } from './interfaces/success-props.interface';
import { SuccessTemplate } from './success.html';

export const Success: React.FC<SuccessProps> = (props) => <SuccessTemplate {...props} />;
