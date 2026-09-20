import React from 'react';
import type { GlowCardProps } from './interfaces/glow-card-props.interface';
import { GlowCardTemplate } from './glow-card.html';

export const GlowCard: React.FC<GlowCardProps> = ({
  selected = false,
  as = 'button',
  contentPassive = true,
  ...rest
}) => (
  <GlowCardTemplate
    selected={selected}
    as={as}
    contentPassive={contentPassive}
    {...rest}
  />
);
