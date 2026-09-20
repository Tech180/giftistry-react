import React from 'react';
import type { AiProps } from './interfaces/ai-props.interface';
import { AiTemplate } from './ai.html';

export const Ai: React.FC<AiProps> = (props) => <AiTemplate {...props} />;
