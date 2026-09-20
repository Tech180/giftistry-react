import React from 'react';
import { InstallStepTemplate } from './install-step.html';
import type { InstallStepProps } from './interfaces/props.interface';
import { getInstallLabelModifier } from '../../utils/get-install-label-modifier.util';

export const InstallStep: React.FC<InstallStepProps> = ({ installTasks }) => {
  const rows = installTasks.map((task) => ({
    task,
    labelModifier: getInstallLabelModifier(task.status),
  }));

  return (
    <InstallStepTemplate
      rows = {
        rows
      }
    />
  );
};
