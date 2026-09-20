import React from 'react';
import type { DoneProps } from './interfaces/done-props.interface';
import { DoneTemplate } from './done.html';

export const Done: React.FC<DoneProps> = () => <DoneTemplate />;
