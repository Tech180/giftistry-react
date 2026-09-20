import React from 'react';
import { Badge } from '../badge/badge.component';
import { AiDisabledIcon, AiSparklesIcon } from '../badge/icons/ai-badge-icons';
import type { TemplateProps } from './interfaces/template-props.interface';

export const AiStatusBadgeTemplate: React.FC<TemplateProps> = ({
  enabled,
  isCompact,
  displayLabel,
  gradientId,
  onToggle,
  disabled = false,
  resolvedAriaLabel,
  label,
}) => (
  <Badge
    effect = {
      'rainbow'
    }
    active = {
      enabled
    }
    size = {
      isCompact ? 'compact' : 'md'
    }
    gradientId = {
      gradientId
    }
    icon = {
      <AiSparklesIcon
        gradientId = {
          gradientId
        }
      />
    }
    iconInactive = {
      <AiDisabledIcon />
    }
    onClick = {
      onToggle
    }
    disabled = {
      disabled
    }
    ariaLabel = {
      resolvedAriaLabel
    }
    ariaPressed = {
      label ? undefined : enabled
    }
  >
    {isCompact ? undefined : displayLabel}
  </Badge>
);
