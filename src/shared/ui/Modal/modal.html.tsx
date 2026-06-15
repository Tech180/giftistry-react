import React from 'react';
import { X } from 'lucide-react';
import { ModalTemplateProps } from 'shared/interfaces/modal-template-props.interface';
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
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={`${styles.modal} animate-scale-in`} ref={modalRef} role="dialog" aria-modal="true">
        <header className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};
