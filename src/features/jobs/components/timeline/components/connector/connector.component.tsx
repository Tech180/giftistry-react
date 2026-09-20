import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ConnectorTemplate } from './connector.html';
import styles from './connector.module.css';

export const Connector: React.FC<Props> = ({ filled, active, isLast }) => {
  if (isLast) {
    return null;
  }

  const fillClassName = [
    styles.fill,
    filled ? styles['fill--filled'] ?? '' : '',
    active ? styles['fill--active'] ?? '' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const fillMobileClassName = [
    styles.fillMobile,
    filled ? styles['fillMobile--filled'] ?? '' : '',
    active ? styles['fillMobile--active'] ?? '' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ConnectorTemplate
      connectorDesktopClassName = {
        styles.connectorDesktop
      }
      connectorMobileClassName = {
        styles.connectorMobile
      }
      fillClassName = {
        fillClassName
      }
      fillMobileClassName = {
        fillMobileClassName
      }
    />
  );
};
