import React from 'react';
import type { FooterProps } from './interfaces/footer-props.interface';
import { FooterTemplate } from './footer.html';

export const Footer: React.FC<FooterProps> = (props) => <FooterTemplate {...props} />;
