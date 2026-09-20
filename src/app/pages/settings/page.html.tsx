import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ProcessesRail } from './components/processes-rail/processes-rail.component';
import { Sidebar } from './components/sidebar/sidebar.component';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';
import styles from './page.module.css';

export const PageTemplate: React.FC<PageTemplateProps> = ({
  routes,
  toasts,
  isAdmin,
  isOwner,
  processesRailScope,
  onProcessesError,
}) => (
  <div className={styles['page']}>
    <Sidebar isAdmin={isAdmin} isOwner={isOwner} />

    <main className={styles['page__main']}>
      <div className={styles['page__route-content']}>{routes}</div>
    </main>

    {
      processesRailScope ? (
        <ProcessesRail scope={processesRailScope} onError={onProcessesError} />
      ) : null
    }

    <div className={styles['page__toast-container']}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles['page__toast']} ${styles['page__toast--show']}`}
        >
          {toast.type === 'success' ? (
            <CheckCircle
              size={18}
              className={`${styles['page__toast-icon']} ${styles['page__toast-icon--success']}`}
            />
          ) : null}
          {toast.type === 'error' ? (
            <AlertCircle
              size={18}
              className={`${styles['page__toast-icon']} ${styles['page__toast-icon--error']}`}
            />
          ) : null}
          {toast.type === 'info' ? (
            <Info
              size={18}
              className={`${styles['page__toast-icon']} ${styles['page__toast-icon--info']}`}
            />
          ) : null}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  </div>
);
