import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { SettingsTemplateProps } from './interfaces/settings-template-props.interface';
import { SettingsSidebar } from './components/settings-sidebar/settings-sidebar.component';
import { ProcessesRail } from './components/processes-rail/processes-rail.component';
import styles from './settings.module.css';

export const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  routes,
  toasts,
  isAdmin,
  processesRailScope,
  onProcessesError,
}) => {
  return (
    <div className={styles['app-body']}>
      <SettingsSidebar isAdmin={isAdmin} />

      <main className={styles['main-wrapper']}>
        <div className={styles['route-content']}>{routes}</div>
      </main>

      {processesRailScope ? (
        <ProcessesRail scope={processesRailScope} onError={onProcessesError} />
      ) : null}

      <div className={styles['toast-container']}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles['toast-show']}`}>
            {toast.type === 'success' && (
              <CheckCircle size={18} className={`${styles['toast-icon']} ${styles.success}`} />
            )}
            {toast.type === 'error' && (
              <AlertCircle size={18} className={`${styles['toast-icon']} ${styles.error}`} />
            )}
            {toast.type === 'info' && (
              <Info size={18} className={`${styles['toast-icon']} ${styles.info}`} />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
