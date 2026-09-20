import type { DrawerVariant } from '../interfaces/drawer-variant.type';
import styles from '../drawer.module.css';

export const buildClasses = ({
  position,
  variant,
  isSheet,
  overflowVisible,
  isOpen,
}: {
  position: 'left' | 'right';
  variant: DrawerVariant;
  isSheet: boolean;
  overflowVisible: boolean;
  isOpen: boolean;
}) => {
  const isOverlay = variant === 'overlay';

  const drawerClass = [
    styles.drawer,
    position === 'left' ? styles['drawer--left'] : styles['drawer--right'],
    isOverlay ? styles['drawer--variant-overlay'] : '',
    isSheet ? styles['drawer--sheet'] : '',
    overflowVisible ? styles['drawer--overflow-visible'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const headerClass = [
    styles['drawer__header'],
    isOverlay ? styles['drawer__header--overlay'] : '',
    isSheet ? styles['drawer__header--sheet'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const titleClass = [
    styles['drawer__title'],
    isOverlay ? styles['drawer__title--overlay'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const footerClass = [
    styles['drawer__footer'],
    isSheet ? styles['drawer__footer--sheet'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const overlayClass = [
    styles['drawer__overlay'],
    isSheet ? styles['drawer__overlay--sheet-scrim'] : '',
    isOpen ? styles['drawer__overlay--active'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    drawerClass,
    headerClass,
    titleClass,
    footerClass,
    overlayClass,
  };
};
