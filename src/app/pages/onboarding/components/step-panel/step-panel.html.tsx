import React from 'react';
import type { StepPanelTemplateProps } from './interfaces/step-panel-template-props.interface';
import { PanelPhaseProvider } from './stagger-item.component';
import styles from './step-panel.module.css';

export const StepPanelTemplate: React.FC<StepPanelTemplateProps> = ({
  panelPhase,
  panelKey,
  children,
}) => {
  const panelClass = [
    styles['step-panel'],
    panelPhase === 'leaving' ? styles['step-panel--leaving'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles['step-panel__stack']}>
      <div key={panelKey} className={panelClass}>
        <PanelPhaseProvider phase={panelPhase}>{children}</PanelPhaseProvider>
      </div>
    </div>
  );
};
