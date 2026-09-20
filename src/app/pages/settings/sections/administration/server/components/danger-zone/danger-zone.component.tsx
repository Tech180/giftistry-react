import React from 'react';
import type { Props } from './interfaces/props.interface';
import { DangerZoneTemplate } from './danger-zone.html';

export const DangerZone: React.FC<Props> = (props) => <DangerZoneTemplate {...props} />;
