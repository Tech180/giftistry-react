import { useLayoutEffect, useRef } from 'react';
import { DrawerProps } from './interfaces/drawer-props.interface';
import { DrawerTemplate } from './drawer.html';
import styles from './drawer.module.css';

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  position,
  title,
  onClose,
  children,
  overflowVisible = false,
  miniDrawer,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    if (isOpen) {
      el.classList.remove(styles.active);
      void el.getBoundingClientRect();
      el.classList.add(styles.active);
    } else {
      el.classList.remove(styles.active);
    }
  }, [isOpen]);

  const drawerClass = [
    styles['drawer-wrapper'],
    position === 'left' ? styles.left : styles.right,
    overflowVisible ? styles['overflow-visible'] : '',
  ].filter(Boolean).join(' ');

  return (
    <DrawerTemplate
      drawerRef={drawerRef}
      drawerClass={drawerClass}
      title={title}
      onClose={onClose}
      overflowVisible={overflowVisible}
      miniDrawer={miniDrawer}
    >
      {children}
    </DrawerTemplate>
  );
};
