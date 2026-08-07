import React from 'react';
import type { TrackProps } from './interfaces/track-props.interface';
import { TrackTemplate } from './track.html';

export const Track: React.FC<TrackProps> = (props) => {
  return <TrackTemplate {...props} />;
};
