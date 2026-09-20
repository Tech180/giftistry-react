import React from 'react';
import type { MailProps } from './interfaces/mail-props.interface';
import { MailTemplate } from './mail.html';

export const Mail: React.FC<MailProps> = (props) => <MailTemplate {...props} />;
