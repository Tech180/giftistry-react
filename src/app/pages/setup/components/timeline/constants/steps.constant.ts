import type { Step } from '../interfaces/step.interface';

export const STEPS: readonly Step[] = [
  { id: 1, label: 'Database', desc: 'Storage configuration' },
  { id: 2, label: 'Administrator', desc: 'Create primary user' },
  { id: 3, label: 'Installation', desc: 'System initialization' },
];
