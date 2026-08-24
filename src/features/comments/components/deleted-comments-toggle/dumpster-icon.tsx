import React from 'react';

export interface DumpsterIconProps {
  size?: number | string;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

/** Wheeled dumpster — distinct from Lucide Trash2 (household bin). */
export const DumpsterIcon: React.FC<DumpsterIconProps> = ({
  size = 24,
  className,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    {/* Lid */}
    <path d="M3 7h18" />
    <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
    {/* Body */}
    <path d="M4.5 7 5.5 17.5a1.5 1.5 0 0 0 1.5 1.3h10a1.5 1.5 0 0 0 1.5-1.3L19.5 7" />
    {/* Front ridges */}
    <path d="M9 10.5v5" />
    <path d="M12 10.5v5" />
    <path d="M15 10.5v5" />
    {/* Wheels */}
    <circle cx="8" cy="20.5" r="1.5" />
    <circle cx="16" cy="20.5" r="1.5" />
  </svg>
);
