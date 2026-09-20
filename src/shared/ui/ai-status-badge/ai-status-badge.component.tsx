import React, { useId } from 'react';
import type { Props } from './interfaces/props.interface';
export type { AiStatusBadgeProps, AiStatusBadgeSize } from './interfaces/props.interface';
import { AiStatusBadgeTemplate } from './ai-status-badge.html';

export const AiStatusBadge: React.FC<Props> = ({
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
    <AiStatusBadgeTemplate
      enabled = {
        enabled
      }
      size = {
        size
      }
      label = {
        label
      }
      onToggle = {
        onToggle
      }
      disabled = {
        disabled
      }
      ariaLabel = {
        ariaLabel
      }
      ariaLabelEnabled = {
        ariaLabelEnabled
      }
      ariaLabelDisabled = {
        ariaLabelDisabled
      }
      gradientId = {
        gradientId
      }
      isCompact = {
        isCompact
      }
      displayLabel = {
        displayLabel
      }
      resolvedAriaLabel = {
        resolvedAriaLabel
      }
    />
  );
};
