import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ItemTemplate } from './item.html';
import styles from './item.module.css';

export const Item: React.FC<Props> = ({
  icon,
  label,
  isActive,
  href,
  onClick,
  className = '',
}) => {
  const itemClass = [styles.item, isActive ? styles.active : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <ItemTemplate
      icon = {
        icon
      }
      label = {
        label
      }
      isActive = {
        isActive
      }
      href = {
        href
      }
      onClick = {
        onClick
      }
      itemClass = {
        itemClass
      }
    />
  );
};
