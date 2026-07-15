import React, { useId } from 'react';
import { Badge } from '../badge/badge.component';
import { AiDisabledIcon, AiSparklesIcon } from '../badge/icons/ai-badge-icons';

export type AiStatusBadgeSize = 'default' | 'compact';

export interface AiStatusBadgeProps {
  enabled: boolean;
  size?: AiStatusBadgeSize;
  label?: string;
  onToggle?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelEnabled?: string;
  ariaLabelDisabled?: string;
}

export const AiStatusBadge: React.FC<AiStatusBadgeProps> = ({
  enabled,
  size = 'default',
  label,
  onToggle,
  disabled = false,
  ariaLabel,
  ariaLabelEnabled = 'AI enabled',
  ariaLabelDisabled = 'AI disabled',
}) => {
  const gradientId = `ai-status-badge-gradient-${useId().replace(/:/g, '')}`;
  const isCompact = size === 'compact';
  const displayLabel = label ?? (enabled ? 'AI Enabled' : 'AI Disabled');
  const resolvedAriaLabel = label
    ? (ariaLabel ?? label)
    : (enabled ? ariaLabelEnabled : ariaLabelDisabled);

  return (
    <Badge
      effect="rainbow"
      active={enabled}
      size={isCompact ? 'compact' : 'md'}
      gradientId={gradientId}
      icon={<AiSparklesIcon gradientId={gradientId} />}
      iconInactive={<AiDisabledIcon />}
      onClick={onToggle}
      disabled={disabled}
      ariaLabel={resolvedAriaLabel}
      ariaPressed={label ? undefined : enabled}
    >
      {isCompact ? undefined : displayLabel}
    </Badge>
  );
};
