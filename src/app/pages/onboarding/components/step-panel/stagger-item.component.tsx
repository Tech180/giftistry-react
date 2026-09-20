import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { PanelPhase } from '../../interfaces/panel-phase.type';
import styles from './step-panel.module.css';

const PanelPhaseContext = createContext<PanelPhase>('active');

export const PanelPhaseProvider: React.FC<{
  phase: PanelPhase;
  children: ReactNode;
}> = ({ phase, children }) => (
  <PanelPhaseContext.Provider value={phase}>{children}</PanelPhaseContext.Provider>
);

export const StaggerItem: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const phase = useContext(PanelPhaseContext);
  const phaseClass =
    phase === 'active'
      ? styles['step-panel__stagger--enter']
      : styles['step-panel__stagger--leave'];

  return (
    <div
      className={[styles['step-panel__stagger'], phaseClass, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
};
