import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Check } from 'lucide-react';
import { BrandMark } from 'shared/ui/brand-mark/brand-mark.component';
import { Button } from 'shared/ui/button/button.component';
import { Switch } from 'shared/ui/switch/switch.component';
import type { SpotlightRect } from './interfaces/spotlight-rect.interface';
import type { SpotlightTemplateProps } from './interfaces/spotlight-template-props.interface';
import styles from './spotlight.module.css';
import { buildCutoutClipPath } from './utils/build-cutout-clip-path.util';

export const SpotlightTemplate: React.FC<SpotlightTemplateProps> = ({
  paddedRect,
  cutoutHoles,
  title,
  body,
  mode,
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
  titleId,
  cardRef,
  cardStyle,
  onNext,
  onBack,
  onSkip,
  footerExtra,
  features,
  tutorialEnabled,
  onTutorialEnabledChange,
  onStart,
  onClose,
  startLabel,
  closeLabel,
  tutorialToggleLabel,
  continueLabel,
  exitLabel,
  onContinue,
  onExit,
}) => {
  const isCentered = placement === 'center' || !paddedRect || mode === 'welcome' || mode === 'interstitial';
  const paneClass = [
    styles['spotlight__pane'],
    lockOutside ? '' : styles['spotlight__pane--pass'],
  ]
    .filter(Boolean)
    .join(' ');

  const cardClass = [
    styles['spotlight__card'],
    isCentered ? styles['spotlight__card--center'] : '',
    mode === 'welcome' ? styles['spotlight__card--large'] : '',
    mode === 'interstitial' ? styles['spotlight__card--interstitial'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const actionsClass = [
    styles['spotlight__actions'],
    styles['spotlight__actions--bordered'],
    mode === 'welcome' || mode === 'interstitial' ? styles['spotlight__actions--stacked'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div
      className = {
        styles['spotlight']
      }
      role = {
        isDialog ? 'dialog' : 'region'
      }
      aria-modal = {
        isDialog ? true : undefined
      }
      aria-label = {
        isDialog ? undefined : 'Tutorial'
      }
      aria-labelledby = {
        titleId
      }
      aria-live = {
        isDialog ? undefined : 'polite'
      }
    >
      {cutoutHoles.length > 0 ? (
        <CutoutPanes
          holes = {
            cutoutHoles
          }
          paneClass = {
            paneClass
          }
        />
      ) : (
        <div
          className = {
            paneClass
          }
          style = {
            { inset: 0 }
          }
          aria-hidden = {
            true
          }
        />
      )}

      {cutoutHoles.map((hole, index) => (
        <div
          key = {
            `ring-${index}`
          }
          className = {
            styles['spotlight__ring']
          }
          style = {
            {
              top: hole.top,
              left: hole.left,
              width: hole.width,
              height: hole.height,
            }
          }
          aria-hidden = {
            true
          }
        />
      ))}

      <div
        ref = {
          cardRef
        }
        className = {
          cardClass
        }
        style = {
          isCentered ? undefined : cardStyle
        }
      >
        {mode === 'welcome' ? (
          <WelcomeBody
            titleId = {
              titleId
            }
            title = {
              title
            }
            body = {
              body
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
            tutorialToggleLabel = {
              tutorialToggleLabel
            }
            actionsClass = {
              actionsClass
            }
            startLabel = {
              startLabel
            }
            closeLabel = {
              closeLabel
            }
            onStart = {
              onStart
            }
            onClose = {
              onClose
            }
          />
        ) : null}

        {mode === 'interstitial' ? (
          <InterstitialBody
            titleId = {
              titleId
            }
            title = {
              title
            }
            body = {
              body
            }
            actionsClass = {
              actionsClass
            }
            continueLabel = {
              continueLabel
            }
            exitLabel = {
              exitLabel
            }
            onContinue = {
              onContinue
            }
            onExit = {
              onExit
            }
          />
        ) : null}

        {mode === 'step' ? (
          <StepBody
            titleId = {
              titleId
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
            interactionHint = {
              interactionHint
            }
            actionsClass = {
              actionsClass
            }
            showSkip = {
              showSkip
            }
            skipLabel = {
              skipLabel
            }
            showBack = {
              showBack
            }
            showNext = {
              showNext
            }
            nextLabel = {
              nextLabel
            }
            onSkip = {
              onSkip
            }
            onBack = {
              onBack
            }
            onNext = {
              onNext
            }
            footerExtra = {
              footerExtra
            }
          />
        ) : null}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

function WelcomeBody({
  titleId,
  title,
  body,
  features,
  tutorialEnabled,
  onTutorialEnabledChange,
  tutorialToggleLabel,
  actionsClass,
  startLabel,
  closeLabel,
  onStart,
  onClose,
}: {
  titleId: string;
  title: string;
  body: string;
  features: SpotlightTemplateProps['features'];
  tutorialEnabled: boolean;
  onTutorialEnabledChange?: (enabled: boolean) => void;
  tutorialToggleLabel: string;
  actionsClass: string;
  startLabel: string;
  closeLabel: string;
  onStart?: () => void;
  onClose?: () => void;
}) {
  const toggleId = `${titleId}-tutorial-toggle`;

  return (
    <>
      <div className = {
        styles['spotlight__hero']
      }>
        <div
          className = {
            styles['spotlight__brand']
          }
          aria-hidden = {
            true
          }
        >
          <BrandMark
            size = {
              'lg'
            }
            showLabel = {
              false
            }
          />
        </div>
        <h2
          id = {
            titleId
          }
          className = {
            [styles['spotlight__title'], styles['spotlight__title--hero']].join(' ')
          }
        >
          {title}
        </h2>
        <p className = {
          styles['spotlight__body']
        }>
          {body}
        </p>
      </div>

      {features.length > 0 ? (
        <ul className = {
          styles['spotlight__features']
        }>
          {features.map((feature) => (
            <li
              key = {
                feature.title
              }
              className = {
                styles['spotlight__feature']
              }
            >
              <span
                className = {
                  styles['spotlight__feature-icon']
                }
                aria-hidden = {
                  true
                }
              >
                {feature.icon}
              </span>
              <span className = {
                styles['spotlight__feature-copy']
              }>
                <span className = {
                  styles['spotlight__feature-title']
                }>
                  {feature.title}
                </span>
                <span className = {
                  styles['spotlight__feature-desc']
                }>
                  {feature.description}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className = {
        styles['spotlight__toggle-row']
      }>
        <label
          htmlFor = {
            toggleId
          }
          className = {
            styles['spotlight__toggle-label']
          }
        >
          {tutorialToggleLabel}
        </label>
        <Switch
          id = {
            toggleId
          }
          checked = {
            tutorialEnabled
          }
          onChange = {
            (checked) => onTutorialEnabledChange?.(checked)
          }
          aria-label = {
            tutorialToggleLabel
          }
        />
      </div>

      <div className = {
        actionsClass
      }>
        {tutorialEnabled ? (
          <Button
            className = {
              styles['spotlight__action-full']
            }
            onClick = {
              onStart
            }
          >
            {startLabel}
          </Button>
        ) : (
          <Button
            className = {
              styles['spotlight__action-full']
            }
            variant = {
              'secondary'
            }
            onClick = {
              onClose
            }
          >
            {closeLabel}
          </Button>
        )}
      </div>
    </>
  );
}

function InterstitialBody({
  titleId,
  title,
  body,
  actionsClass,
  continueLabel,
  exitLabel,
  onContinue,
  onExit,
}: {
  titleId: string;
  title: string;
  body: string;
  actionsClass: string;
  continueLabel: string;
  exitLabel: string;
  onContinue?: () => void;
  onExit?: () => void;
}) {
  return (
    <>
      <div
        className = {
          styles['spotlight__success']
        }
        aria-hidden = {
          true
        }
      >
        <Check
          size = {
            28
          }
          strokeWidth = {
            2.5
          }
        />
      </div>
      <h2
        id = {
          titleId
        }
        className = {
          styles['spotlight__title']
        }
      >
        {title}
      </h2>
      <p className = {
        styles['spotlight__body']
      }>
        {body}
      </p>
      <div className = {
        actionsClass
      }>
        <Button
          className = {
            styles['spotlight__action-full']
          }
          onClick = {
            onContinue
          }
        >
          {continueLabel}
        </Button>
        <Button
          className = {
            styles['spotlight__action-full']
          }
          variant = {
            'ghost'
          }
          onClick = {
            onExit
          }
        >
          {exitLabel}
        </Button>
      </div>
    </>
  );
}

function StepBody({
  titleId,
  title,
  body,
  progress,
  interactionHint,
  actionsClass,
  showSkip,
  skipLabel,
  showBack,
  showNext,
  nextLabel,
  onSkip,
  onBack,
  onNext,
  footerExtra,
}: {
  titleId: string;
  title: string;
  body: string;
  progress?: SpotlightTemplateProps['progress'];
  interactionHint?: string;
  actionsClass: string;
  showSkip: boolean;
  skipLabel: string;
  showBack: boolean;
  showNext: boolean;
  nextLabel: string;
  onSkip?: () => void;
  onBack?: () => void;
  onNext?: () => void;
  footerExtra?: React.ReactNode;
}) {
  return (
    <>
      {progress ? (
        <div className = {
          styles['spotlight__progress']
        }>
          <div
            className = {
              styles['spotlight__segments']
            }
            role = {
              'progressbar'
            }
            aria-valuemin = {
              0
            }
            aria-valuemax = {
              100
            }
            aria-valuenow = {
              Math.round(
                ((progress.chapterIndex + progress.chapterFillPercent / 100) /
                  Math.max(progress.chapterCount, 1)) *
                  100
              )
            }
            aria-label = {
              `Chapter ${progress.chapterIndex + 1} of ${progress.chapterCount}`
            }
          >
            {Array.from({ length: progress.chapterCount }, (_, index) => {
              const fill =
                index < progress.chapterIndex
                  ? 100
                  : index === progress.chapterIndex
                    ? progress.chapterFillPercent
                    : 0;

              return (
                <span
                  key = {
                    index
                  }
                  className = {
                    styles['spotlight__segment']
                  }
                >
                  <span
                    className = {
                      styles['spotlight__segment-fill']
                    }
                    style = {
                      { width: `${fill}%` }
                    }
                  />
                </span>
              );
            })}
          </div>
          <p className = {
            styles['spotlight__progress-label']
          }>
            {`Chapter ${progress.chapterIndex + 1}: ${progress.chapterTitle}`}
          </p>
        </div>
      ) : null}

      <h2
        id = {
          titleId
        }
        className = {
          styles['spotlight__title']
        }
      >
        {title}
      </h2>
      <p className = {
        styles['spotlight__body']
      }>
        {body}
      </p>

      {interactionHint ? (
        <p className = {
          styles['spotlight__hint']
        }>
          <ArrowRight
            size = {
              16
            }
            aria-hidden = {
              true
            }
            className = {
              styles['spotlight__hint-icon']
            }
          />
          <span>{interactionHint}</span>
        </p>
      ) : null}

      <div className = {
        actionsClass
      }>
        <div className = {
          styles['spotlight__actions-start']
        }>
          {showSkip && onSkip ? (
            <Button
              variant = {
                'ghost'
              }
              onClick = {
                onSkip
              }
            >
              {skipLabel}
            </Button>
          ) : null}
          {footerExtra}
        </div>
        <div className = {
          styles['spotlight__actions-end']
        }>
          {showBack && onBack ? (
            <Button
              variant = {
                'secondary'
              }
              onClick = {
                onBack
              }
            >
              Back
            </Button>
          ) : null}
          {showNext && onNext ? (
            <Button
              onClick = {
                onNext
              }
            >
              {nextLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}

function CutoutPanes({ holes, paneClass }: { holes: SpotlightRect[]; paneClass: string }) {
  const clipPath = buildCutoutClipPath(holes, window.innerWidth, window.innerHeight);

  return (
    <div
      className = {
        paneClass
      }
      style = {
        {
          inset: 0,
          clipPath,
        }
      }
      aria-hidden = {
        true
      }
    />
  );
}
