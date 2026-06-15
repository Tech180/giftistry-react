import React, { useEffect, useRef } from 'react';
import { ModalProps } from 'shared/interfaces/modal-props.interface';
import { ModalTemplate } from './modal.html';

export type { ModalProps } from 'shared/interfaces/modal-props.interface';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      modalRef={modalRef}
      handleBackdropClick={handleBackdropClick}
    >
      {children}
    </ModalTemplate>
  );
};
