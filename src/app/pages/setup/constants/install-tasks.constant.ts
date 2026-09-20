import type { InstallTask } from '../interfaces/install-task.interface';

export const INITIAL_INSTALL_TASKS: InstallTask[] = [
  { id: 't-db', label: 'Connecting to database...', status: 'pending' },
  { id: 't-schema', label: 'Applying schema migrations...', status: 'pending' },
  { id: 't-admin', label: 'Registering administrative user...', status: 'pending' },
  { id: 't-config', label: 'Writing configuration files...', status: 'pending' },
];
