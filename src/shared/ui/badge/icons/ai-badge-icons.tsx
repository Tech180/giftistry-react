import React from 'react';

interface AiSparklesIconProps {
  gradientId: string;
  className?: string;
}

export const AiSparklesIcon: React.FC<AiSparklesIconProps> = ({ gradientId, className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill={`url(#${gradientId})`}
      d="M11.536 2.11572C11.7226 1.4883 12.6107 1.4883 12.7972 2.11572L14.0729 6.40939C14.1687 6.73177 14.4283 6.99127 14.7506 7.08709L19.0443 8.36279C19.6717 8.5493 19.6717 9.43736 19.0443 9.62387L14.7506 10.8996C14.4283 10.9954 14.1687 11.2549 14.0729 11.5773L12.7972 15.871C12.6107 16.4984 11.7226 16.4984 11.536 15.871L10.2604 11.5773C10.1646 11.2549 9.90503 10.9954 9.58265 10.8996L5.28896 9.62387C4.66154 9.43736 4.66154 8.5493 5.28896 8.36279L9.58265 7.08709C9.90503 6.99127 10.1646 6.73177 10.2604 6.40939L11.536 2.11572Z"
    />
    <path
      fill={`url(#${gradientId})`}
      d="M19.3499 15.1102C19.4672 14.7158 20.0256 14.7158 20.1428 15.1102L20.6133 16.6934C20.6734 16.896 20.8365 17.0591 21.0392 17.1193L22.6223 17.5898C23.0167 17.707 23.0167 18.2655 22.6223 18.3827L21.0392 18.8533C20.8365 18.9134 20.6734 19.0765 20.6133 19.2792L20.1428 20.8623C20.0256 21.2567 19.4672 21.2567 19.3499 20.8623L18.8794 19.2792C18.8193 19.0765 18.6562 18.9134 18.4535 18.8533L16.8704 18.3827C16.476 18.2655 16.476 17.707 16.8704 17.5898L18.4535 17.1193C18.6562 17.0591 18.8193 16.896 18.8794 16.6934L19.3499 15.1102Z"
    />
  </svg>
);

export const AiDisabledIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
      opacity="0.5"
    />
    <line x1="3" y1="3" x2="21" y2="21" />
  </svg>
);
