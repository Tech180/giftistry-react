import React from 'react';
import { X } from 'lucide-react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { ModalTemplateProps } from './interfaces/modal-template-props.interface';
import styles from './modal.module.css';

export const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  title,
  children,
  modalRef,
  handleBackdropClick,
}) => {
  if (!isOpen) return null;

  return (
    <EnterPanel animation="fade" className={styles.backdrop} onClick={handleBackdropClick}>
      <EnterPanel
        animation="scale"
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button className={styles['close-button']} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </EnterPanel>
    </EnterPanel>
  );
};
