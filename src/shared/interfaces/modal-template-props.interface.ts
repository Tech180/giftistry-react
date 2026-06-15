import { RefObject } from 'react';
import { ModalProps } from './modal-props.interface';

export interface ModalTemplateProps extends ModalProps {
  modalRef: RefObject<HTMLDivElement | null>;
  handleBackdropClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}
