import React from 'react';
import { createPortal } from 'react-dom';
import { LoadingState, Spotlight } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './host.module.css';

export const HostTemplate: React.FC<TemplateProps> = ({
  isActive,
  isPreparing,
  mode,
  targetRect,
  extraRects,
  title,
  body,
  progress,
  placement,
  showNext,
  nextLabel,
  showBack,
  showSkip,
  skipLabel,
  isDialog,
  interactionHint,
  lockOutside,
  features,
  tutorialEnabled,
  onTutorialEnabledChange,
  startLabel,
  closeLabel,
  tutorialToggleLabel,
  continueLabel,
  exitLabel,
  onNext,
  onBack,
  onSkip,
  onStart,
  onClose,
  onContinue,
  onExit,
}) => {
  if (!isActive) {
    return null;
  }

  if (isPreparing) {
    return createPortal(
      <div
        className = {
          styles['preparing']
        }
        role = {
          'status'
        }
        aria-live = {
          'polite'
        }
        aria-busy = {
          true
        }
      >
        <LoadingState
          message = {
            'Loading sample list…'
          }
          fullHeight = {
            true
          }
        />
      </div>,
      document.body
    );
  }

  return (
    <Spotlight
      mode = {
        mode
      }
      targetRect = {
        targetRect
      }
      extraRects = {
        extraRects
      }
      title = {
        title
      }
      body = {
        body
      }
      progress = {
        progress
      }
      placement = {
        placement
      }
      showNext = {
        showNext
      }
      nextLabel = {
        nextLabel
      }
      showBack = {
        showBack
      }
      showSkip = {
        showSkip
      }
      skipLabel = {
        skipLabel
      }
      isDialog = {
        isDialog
      }
      interactionHint = {
        interactionHint
      }
      lockOutside = {
        lockOutside
      }
      features = {
        features
      }
      tutorialEnabled = {
        tutorialEnabled
      }
      onTutorialEnabledChange = {
        onTutorialEnabledChange
      }
      startLabel = {
        startLabel
      }
      closeLabel = {
        closeLabel
      }
      tutorialToggleLabel = {
        tutorialToggleLabel
      }
      continueLabel = {
        continueLabel
      }
      exitLabel = {
        exitLabel
      }
      onNext = {
        onNext
      }
      onBack = {
        onBack
      }
      onSkip = {
        onSkip
      }
      onStart = {
        onStart
      }
      onClose = {
        onClose
      }
      onContinue = {
        onContinue
      }
      onExit = {
        onExit
      }
    />
  );
};
