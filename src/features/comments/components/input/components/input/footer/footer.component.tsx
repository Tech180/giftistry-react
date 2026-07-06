import React from 'react';
import { FooterProps } from './interfaces/footer-props.interface';
import { FooterTemplate } from './footer.html';

export const InputFooter: React.FC<FooterProps> = (props) => <FooterTemplate {...props} />;
