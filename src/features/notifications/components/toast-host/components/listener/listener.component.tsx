import React from 'react';
import { useJobToast } from '../../../../hooks/use-job-toast';

/** Null-render mount that always runs the job-toast socket listener. */
export const Listener: React.FC = () => {
  useJobToast();
  return null;
};
