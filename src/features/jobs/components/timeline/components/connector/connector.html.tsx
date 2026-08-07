import React from 'react';
import type { ConnectorProps } from './interfaces/connector-props.interface';
import styles from './connector.module.css';

export const ConnectorTemplate: React.FC<ConnectorProps> = ({
  filled,
  active,
  isLast,
}) => {
  if (isLast) return null;

  const classNames = [
    filled ? styles.filled : '',
    active ? styles.active : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <span
        className={[styles.connectorDesktop, classNames].filter(Boolean).join(' ')}
        aria-hidden
      >
        <span className={styles.fill} />
      </span>
      <span
        className={[styles.connectorMobile, classNames].filter(Boolean).join(' ')}
        aria-hidden
      >
        <span className={styles.fillMobile} />
      </span>
    </>
  );
};
