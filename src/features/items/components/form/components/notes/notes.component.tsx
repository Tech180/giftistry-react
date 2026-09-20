import React from 'react';
import type { Props } from './interfaces/props.interface';
import { NotesTemplate } from './notes.html';

export const Notes: React.FC<Props> = (props) => <NotesTemplate {...props} />;
