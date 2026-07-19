import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMarkTemplateProps } from './interfaces/brand-mark-template-props.interface';
import styles from './brand-mark.module.css';

export const BrandMarkTemplate: React.FC<BrandMarkTemplateProps> = ({
  showLabel,
  to,
  className,
  rootClass,
  iconSize,
}) => {
  const content = (
    <>
      <svg
        className={styles.icon}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <g className={styles['gift-lid']}>
          <path d="M4 7h16v3H4z" />
          <path d="M12 7c-1.5-2.5-4-2.5-4 0 0 1.5 2.5 2.5 4 0z" />
          <path d="M12 7c1.5-2.5 4-2.5 4 0 0 1.5-2.5 2.5-4 0z" />
        </g>
        <path d="M5 10h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z" />
        <path d="M12 10v12" />
      </svg>
      {showLabel && <span className={styles.label}>Giftistry</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${rootClass} ${className}`.trim()} aria-label="Giftistry">
        {content}
      </Link>
    );
  }

  return (
    <div className={`${rootClass} ${className}`.trim()} aria-label="Giftistry">
      {content}
    </div>
  );
};
