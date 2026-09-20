import React from 'react';
import { FooterTemplate } from './footer.html';
import type { FooterProps } from './interfaces/props.interface';

export const Footer: React.FC<FooterProps> = ({
  step,
  showFooterBack,
  showFooter,
  isSubmitting,
  onNext,
  onPrev,
  onFinish,
}) => (
  <FooterTemplate
    step = {
      step
    }
    showFooterBack = {
      showFooterBack
    }
    showFooter = {
      showFooter
    }
    isSubmitting = {
      isSubmitting
    }
    onNext = {
      onNext
    }
    onPrev = {
      onPrev
    }
    onFinish = {
      onFinish
    }
  />
);
