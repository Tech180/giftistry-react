import React from 'react';
import type { HelloProps } from './interfaces/hello-props.interface';
import { HelloTemplate } from './hello.html';

export const Hello: React.FC<HelloProps> = (props) => <HelloTemplate {...props} />;
