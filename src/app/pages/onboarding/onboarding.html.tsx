import React from 'react';
import { ArrowLeft, Check, Gift, Link2, Palette, Settings2, UserRound } from 'lucide-react';
import { Badge, BrandMark, Button, Input, Switch } from 'shared/ui';
import { OnboardingTimeline } from './components/timeline/onboarding-timeline.component';
import { OnboardingTemplateProps } from './interfaces/onboarding-template-props.interface';
import styles from './onboarding.module.css';

export const OnboardingTemplate: React.FC<OnboardingTemplateProps> = ({
  step,
  totalSteps,
  stepId,
  visibleStepId,
  panelPhase,
  title,
  subtitle,
  timelineSteps,
  timelineActiveIndex,
  requiresOwner,
  isSubmitting,
  error,
  canSkip,
  firstName,
  lastName,
  bio,
  theme,
  themeOptions,
  publicAppUrl,
  registrationMode,
  smtpType,
  smtpHost,
  smtpPort,
  smtpFrom,
  aiEnabled,
  aiWebSearchEnabled,
  onFieldChange,
  onNext,
  onSkip,
  onBack,
  onGlowMove,
}) => {
  const panelClass = [
    styles['step-panel'],
    panelPhase === 'active' ? styles['step-panel-active'] : styles['step-panel-leaving'],
  ].join(' ');

  return (
    <div className={styles['onboarding-page']}>
      <div className={styles['bg-grid']} aria-hidden="true" />
      <div className={styles['bg-aura']} aria-hidden="true" />

      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <BrandMark size="sm" />
          </div>
          <OnboardingTimeline steps={timelineSteps} activeIndex={timelineActiveIndex} />
        </aside>

        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles['mobile-progress']} aria-hidden="true">
              {Array.from({ length: Math.max(totalSteps - 1, 1) }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles['mobile-dot']} ${
                    index <= Math.min(step, totalSteps - 2) ? styles['mobile-dot-active'] : ''
                  }`}
                />
              ))}
            </div>
            <div
              className={
                visibleStepId === 'hello'
                  ? `${styles['header-row']} ${styles['header-row-hello']}`
                  : styles['header-row']
              }
            >
              <div className={styles['header-copy']}>
                <h1
                  className={
                    visibleStepId === 'hello'
                      ? `${styles.title} ${styles['title-hello']}`
                      : styles.title
                  }
                >
                  {title}
                </h1>
                <p
                  className={
                    visibleStepId === 'hello'
                      ? `${styles.subtitle} ${styles['subtitle-hello']}`
                      : styles.subtitle
                  }
                >
                  {subtitle}
                </p>
              </div>
              {visibleStepId === 'hello' && (
                <div className={styles['hello-mark']} aria-hidden="true">
                  <Gift size={56} strokeWidth={1.25} />
                </div>
              )}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.content}>
            <div className={styles['panel-stack']}>
              <div key={visibleStepId} className={panelClass}>
                {visibleStepId === 'hello' && (
                  <div className={styles['hello-welcome']}>
                    <p className={`${styles['hello-lead']} ${styles['stagger-item']}`}>
                      Giftistry helps you share wishlists with the people who matter —
                      no awkward guessing, just clear lists and happy surprises.
                    </p>

                    <ul className={`${styles['hello-points']} ${styles['stagger-item']}`}>
                      <li>
                        <span className={styles['hello-point-icon']} aria-hidden="true">
                          <Palette size={16} />
                        </span>
                        <span>Choose a look that fits your style</span>
                      </li>
                      <li>
                        <span className={styles['hello-point-icon']} aria-hidden="true">
                          <UserRound size={16} />
                        </span>
                        <span>Add your name so friends recognize you</span>
                      </li>
                      {requiresOwner && (
                        <li>
                          <span className={styles['hello-point-icon']} aria-hidden="true">
                            <Settings2 size={16} />
                          </span>
                          <span>As the owner, finish a few server settings</span>
                        </li>
                      )}
                    </ul>

                    <p className={`${styles['hello-aside']} ${styles['stagger-item']}`}>
                      {requiresOwner
                        ? 'You can skip optional steps and tweak anything later in Settings.'
                        : 'Optional steps can be skipped — you can always change things later.'}
                    </p>
                  </div>
                )}

                {visibleStepId === 'theme' && (
                  <div className={styles['theme-grid']}>
                    {themeOptions.map((option) => {
                      const selected = theme === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`${styles['glow-card']} ${styles['stagger-item']} ${
                            selected ? styles['glow-card-selected'] : ''
                          }`}
                          onClick={() => onFieldChange('theme', option.id)}
                          onMouseMove={onGlowMove}
                        >
                          <div className={`${styles['glow-card-content']} ${styles['glow-card-content-passive']}`}>
                            <div
                              className={styles['theme-preview']}
                              style={{ background: option.previewBg }}
                            >
                              <div className={styles['theme-preview-bar']}>
                                <div className={styles['theme-preview-chip']} />
                                <div
                                  className={styles['theme-preview-dot']}
                                  style={{ background: option.previewAccent }}
                                />
                              </div>
                              <div
                                className={`${styles['theme-preview-line']} ${styles['theme-preview-line-md']}`}
                              />
                              <div
                                className={`${styles['theme-preview-line']} ${styles['theme-preview-line-sm']}`}
                              />
                            </div>
                            <div className={styles['theme-meta']}>
                              <span className={styles['theme-label']}>{option.label}</span>
                              <span
                                className={`${styles['check-indicator']} ${
                                  selected ? styles['check-indicator-on'] : ''
                                }`}
                              >
                                <Check size={10} strokeWidth={3} />
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {visibleStepId === 'profile' && (
                  <div className={styles.fields}>
                    <div className={`${styles['field-row']} ${styles['stagger-item']}`}>
                      <Input
                        label="First Name"
                        value={firstName}
                        onChange={(e) => onFieldChange('firstName', e.target.value)}
                        placeholder="Jane"
                        autoFocus
                      />
                      <Input
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => onFieldChange('lastName', e.target.value)}
                        placeholder="Doe"
                      />
                    </div>
                    <div className={styles['stagger-item']}>
                      <div className={styles['field-label-row']}>
                        <span className={styles.label}>Bio</span>
                        <span className={styles.optional}>Optional</span>
                      </div>
                      <textarea
                        className={styles.textarea}
                        value={bio}
                        onChange={(e) => onFieldChange('bio', e.target.value)}
                        placeholder="A brief description..."
                      />
                    </div>
                  </div>
                )}

                {visibleStepId === 'public_url' && (
                  <div className={`${styles.fields} ${styles['fields-wide']}`}>
                    <div className={styles['stagger-item']}>
                      <span className={styles.label}>Public Application URL</span>
                      <div className={styles['url-field']}>
                        <div className={styles['url-prefix']}>
                          <Link2 size={16} aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          className={styles['url-input']}
                          value={publicAppUrl}
                          onChange={(e) => onFieldChange('publicAppUrl', e.target.value)}
                          placeholder="http://localhost:3000"
                        />
                      </div>
                      <p className={styles['field-hint']}>
                        Used as the base domain for SSO callbacks, email links, and webhook
                        verifications.
                      </p>
                    </div>
                  </div>
                )}

                {visibleStepId === 'registration' && (
                  <div className={styles['radio-list']}>
                    {(
                      [
                        {
                          value: 'invite_only' as const,
                          title: 'Invite Only',
                          desc: 'Users must receive a cryptographic invitation link to join the workspace.',
                          defaultBadge: true,
                        },
                        {
                          value: 'open' as const,
                          title: 'Open Registration',
                          desc: 'Anyone with the public URL can instantiate an account.',
                          defaultBadge: false,
                        },
                        {
                          value: 'disabled' as const,
                          title: 'Disabled',
                          desc: 'New account creation is turned off until you change this later.',
                          defaultBadge: false,
                        },
                      ] as const
                    ).map((option) => {
                      const selected = registrationMode === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`${styles['radio-card']} ${styles['stagger-item']}`}
                        >
                          <input
                            type="radio"
                            name="registrationMode"
                            value={option.value}
                            checked={selected}
                            onChange={() => onFieldChange('registrationMode', option.value)}
                          />
                          <div
                            className={`${styles['glow-card']} ${
                              selected ? styles['glow-card-selected'] : ''
                            }`}
                            onMouseMove={onGlowMove}
                          >
                            <div className={`${styles['glow-card-content']} ${styles['glow-card-content-passive']} ${styles['radio-inner']}`}>
                              <div className={styles['radio-dot-wrap']}>
                                <div className={styles['radio-dot']} />
                              </div>
                              <div>
                                <div className={styles['radio-title-row']}>
                                  <span className={styles['radio-title']}>{option.title}</span>
                                  {option.defaultBadge && (
                                    <Badge size="sm" active>
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <div className={styles['radio-desc']}>{option.desc}</div>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {visibleStepId === 'mail' && (
                  <div className={`${styles.fields} ${styles['fields-wide']}`}>
                    <div className={styles['stagger-item']}>
                      <span className={styles.label}>Transport Protocol</span>
                      <select
                        className={styles.select}
                        value={smtpType}
                        onChange={(e) => onFieldChange('smtpType', e.target.value)}
                      >
                        <option value="local">Local (Mailpit Virtual SMTP)</option>
                        <option value="remote">Remote SMTP Relay</option>
                      </select>
                    </div>

                    {smtpType === 'remote' && (
                      <div className={`${styles['remote-fields']} ${styles['stagger-item']}`}>
                        <div className={styles['field-row']}>
                          <div className={styles['field-grow']}>
                            <Input
                              label="Host"
                              value={smtpHost}
                              onChange={(e) => onFieldChange('smtpHost', e.target.value)}
                              placeholder="smtp.resend.com"
                            />
                          </div>
                          <Input
                            label="Port"
                            value={smtpPort}
                            onChange={(e) => onFieldChange('smtpPort', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <div className={styles['stagger-item']}>
                      <Input
                        label="System Sender Address"
                        type="email"
                        value={smtpFrom}
                        onChange={(e) => onFieldChange('smtpFrom', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {visibleStepId === 'ai' && (
                  <div className={styles['radio-list']}>
                    <div
                      className={`${styles['glow-card']} ${styles['stagger-item']}`}
                      onMouseMove={onGlowMove}
                      role="group"
                    >
                      <div className={`${styles['glow-card-content']} ${styles['toggle-card']}`}>
                        <div className={styles['toggle-copy']}>
                          <div className={styles['toggle-title']}>Enable AI Assistants</div>
                          <div className={styles['toggle-desc']}>
                            Allow users to generate gift ideas using integrated Large Language
                            Models.
                          </div>
                        </div>
                        <Switch
                          checked={aiEnabled}
                          onChange={(checked) => onFieldChange('aiEnabled', checked)}
                          aria-label="Enable AI Assistants"
                        />
                      </div>
                    </div>

                    <div
                      className={`${styles['glow-card']} ${styles['stagger-item']}`}
                      onMouseMove={onGlowMove}
                      role="group"
                    >
                      <div className={`${styles['glow-card-content']} ${styles['toggle-card']}`}>
                        <div className={styles['toggle-copy']}>
                          <div className={styles['toggle-title']}>Real-time Web Search</div>
                          <div className={styles['toggle-desc']}>
                            Permit the AI to scrape live product pricing and availability.
                          </div>
                        </div>
                        <Switch
                          checked={aiWebSearchEnabled}
                          onChange={(checked) => onFieldChange('aiWebSearchEnabled', checked)}
                          aria-label="Real-time Web Search"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {visibleStepId === 'done' && (
                  <div className={styles.done}>
                    <div className={`${styles['done-copy']} ${styles['stagger-item']}`}>
                      <h2 className={styles['done-title']}>Enjoy Giftistry</h2>
                      <p className={styles['done-body']}>
                        Your preferences are saved. Jump in, create a wishlist, and invite the
                        people you celebrate with.
                      </p>
                    </div>
                    <div className={`${styles['done-icon']} ${styles['stagger-item']}`} aria-hidden="true">
                      <div className={styles['done-icon-inner']}>
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            className={styles['check-path']}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div>
              {step > 0 && stepId !== 'done' && (
                <Button
                  variant="ghost"
                  onClick={onBack}
                  disabled={isSubmitting || panelPhase === 'leaving'}
                  leftIcon={<ArrowLeft size={16} />}
                >
                  Back
                </Button>
              )}
            </div>
            <div className={styles['footer-right']}>
              {canSkip && stepId !== 'done' && (
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  disabled={isSubmitting || panelPhase === 'leaving'}
                >
                  Skip
                </Button>
              )}
              <Button
                onClick={onNext}
                disabled={isSubmitting || panelPhase === 'leaving'}
                isLoading={isSubmitting}
              >
                {stepId === 'done' ? 'Enter Dashboard' : stepId === 'hello' ? "Let's go" : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
