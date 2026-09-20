import React from 'react';
import { BrandMark } from 'shared/ui';
import { Footer } from './components/footer/footer.component';
import { Header } from './components/header/header.component';
import { StepPanel } from './components/step-panel/step-panel.component';
import { Timeline } from './components/timeline/timeline.component';
import { Ai } from './components/steps/ai/ai.component';
import { Done } from './components/steps/done/done.component';
import { Hello } from './components/steps/hello/hello.component';
import { Mail } from './components/steps/mail/mail.component';
import { Profile } from './components/steps/profile/profile.component';
import { PublicUrl } from './components/steps/public-url/public-url.component';
import { Registration } from './components/steps/registration/registration.component';
import { Theme } from './components/steps/theme/theme.component';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';
import styles from './page.module.css';

export const PageTemplate: React.FC<PageTemplateProps> = ({
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
  primaryCtaLabel,
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
}) => (
  <div className={styles['page']}>
    <div className={styles['page__bg-grid']} aria-hidden="true" />
    <div className={styles['page__bg-aura']} aria-hidden="true" />

    <div className={styles['page__shell']}>
      <aside className={styles['page__sidebar']}>
        <div className={styles['page__brand']}>
          <BrandMark size="sm" />
        </div>
        <Timeline steps={timelineSteps} activeIndex={timelineActiveIndex} />
      </aside>

      <div className={styles['page__main']}>
        <Header
          step={step}
          totalSteps={totalSteps}
          visibleStepId={visibleStepId}
          title={title}
          subtitle={subtitle}
        />

        {error ? <div className={styles['page__error']}>{error}</div> : null}

        <div className={styles['page__content']}>
          <StepPanel panelPhase={panelPhase} panelKey={visibleStepId}>
            {visibleStepId === 'hello' ? <Hello requiresOwner={requiresOwner} /> : null}
            {visibleStepId === 'theme' ? (
              <Theme
                theme={theme}
                themeOptions={themeOptions}
                onSelect={(id) => onFieldChange('theme', id)}
                onGlowMove={onGlowMove}
              />
            ) : null}
            {visibleStepId === 'profile' ? (
              <Profile
                firstName={firstName}
                lastName={lastName}
                bio={bio}
                onFirstNameChange={(value) => onFieldChange('firstName', value)}
                onLastNameChange={(value) => onFieldChange('lastName', value)}
                onBioChange={(value) => onFieldChange('bio', value)}
              />
            ) : null}
            {visibleStepId === 'public_url' ? (
              <PublicUrl
                publicAppUrl={publicAppUrl}
                onChange={(value) => onFieldChange('publicAppUrl', value)}
              />
            ) : null}
            {visibleStepId === 'registration' ? (
              <Registration
                registrationMode={registrationMode}
                onSelect={(mode) => onFieldChange('registrationMode', mode)}
                onGlowMove={onGlowMove}
              />
            ) : null}
            {visibleStepId === 'mail' ? (
              <Mail
                smtpType={smtpType}
                smtpHost={smtpHost}
                smtpPort={smtpPort}
                smtpFrom={smtpFrom}
                onSmtpTypeChange={(value) => onFieldChange('smtpType', value)}
                onSmtpHostChange={(value) => onFieldChange('smtpHost', value)}
                onSmtpPortChange={(value) => onFieldChange('smtpPort', value)}
                onSmtpFromChange={(value) => onFieldChange('smtpFrom', value)}
              />
            ) : null}
            {visibleStepId === 'ai' ? (
              <Ai
                aiEnabled={aiEnabled}
                aiWebSearchEnabled={aiWebSearchEnabled}
                onAiEnabledChange={(value) => onFieldChange('aiEnabled', value)}
                onAiWebSearchEnabledChange={(value) =>
                  onFieldChange('aiWebSearchEnabled', value)
                }
                onGlowMove={onGlowMove}
              />
            ) : null}
            {visibleStepId === 'done' ? <Done /> : null}
          </StepPanel>
        </div>

        <Footer
          step={step}
          stepId={stepId}
          panelPhase={panelPhase}
          isSubmitting={isSubmitting}
          canSkip={canSkip}
          primaryCtaLabel={primaryCtaLabel}
          onBack={onBack}
          onSkip={onSkip}
          onNext={onNext}
        />
      </div>
    </div>
  </div>
);
