export interface FooterProps {
  step: number;
  showFooterBack: boolean;
  showFooter: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrev: () => void;
  onFinish: () => void;
}
