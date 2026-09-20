import styles from '../floating-action-menu.module.css';

type DockState = 'closed' | 'toolbar' | 'panel';

export const buildFaceClasses = ({
  dockState,
  hidePanelHeader,
  tooltipVisible,
}: {
  dockState: DockState;
  hidePanelHeader: boolean;
  tooltipVisible: boolean;
}) => {
  const faceClosedClass = [
    styles['floating-action-menu__face'],
    styles['floating-action-menu__face-closed'],
    dockState === 'closed'
      ? styles['floating-action-menu__face--active']
      : styles['floating-action-menu__face-closed--exiting'],
  ].join(' ');

  const faceToolbarClass = [
    styles['floating-action-menu__face'],
    styles['floating-action-menu__face-toolbar'],
    dockState === 'toolbar' ? styles['floating-action-menu__face--active'] : '',
    dockState === 'closed' ? styles['floating-action-menu__face-toolbar--from-closed'] : '',
    dockState === 'panel' ? styles['floating-action-menu__face-toolbar--from-panel'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const facePanelClass = [
    styles['floating-action-menu__face'],
    styles['floating-action-menu__face-panel'],
    dockState === 'panel' ? styles['floating-action-menu__face--active'] : '',
    dockState === 'closed' ? styles['floating-action-menu__face-panel--from-closed'] : '',
    dockState === 'toolbar' ? styles['floating-action-menu__face-panel--from-toolbar'] : '',
    hidePanelHeader ? styles['floating-action-menu__face-panel--flush'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const backdropClass = [
    styles['floating-action-menu__backdrop'],
    dockState !== 'closed' ? styles['floating-action-menu__backdrop--active'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipClass = [
    styles['floating-action-menu__tooltip'],
    tooltipVisible ? styles['floating-action-menu__tooltip--visible'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    faceClosedClass,
    faceToolbarClass,
    facePanelClass,
    backdropClass,
    tooltipClass,
  };
};
