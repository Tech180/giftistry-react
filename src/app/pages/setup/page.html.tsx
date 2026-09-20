import React from 'react';
import { BrandMark } from 'shared/ui';
import styles from './page.module.css';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';
import { Timeline } from './components/timeline/timeline.component';
import { DatabaseStep } from './components/database-step/database-step.component';
import { AdminStep } from './components/admin-step/admin-step.component';
import { InstallStep } from './components/install-step/install-step.component';
import { SuccessStep } from './components/success-step/success-step.component';
import { Footer } from './components/footer/footer.component';

export const PageTemplate: React.FC<PageTemplateProps> = ({
  step,
  mobileStep,
  showFooterBack,
  showFooter,
  dbType,
  dbUrl,
  adminUsername,
  adminPassword,
  adminConfirmPassword,
  adminFirstName,
  adminLastName,
  showPassword,
  showConfirmPassword,
  errors,
  isSubmitting,
  installTasks,
  onFieldChange,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  onNext,
  onPrev,
  onFinish,
}) => (
  <div className={styles.page}>
    <aside className={styles['page__sidebar']}>
      <div className={styles['page__brand']}>
        <BrandMark
          size = {
            'lg'
          }
          showLabel = {
            false
          }
          className = {
            styles['page__brand-icon']
          }
        />
        <div className={styles['page__brand-text']}>
          <h1 className={styles['page__brand-title']}>Giftistry</h1>
          <p className={styles['page__brand-subtitle']}>Setup Wizard</p>
        </div>
      </div>

      <Timeline
        step = {
          step
        }
      />

      <div className={styles['page__sidebar-footer']}>
        <p className={styles['page__sidebar-meta']}>Giftistry Setup</p>
      </div>
    </aside>

    <main className={styles['page__main']}>
      <header className={styles['page__mobile-header']}>
        <div className={styles['page__mobile-brand']}>
          <BrandMark
            size = {
              'sm'
            }
            showLabel = {
              false
            }
          />
          <span className={styles['page__mobile-title']}>Giftistry Setup</span>
        </div>
        <div className={styles['page__mobile-step']}>Step {mobileStep} of 3</div>
      </header>

      <div className={styles['page__main-scroll']}>
        <div className={styles['page__main-inner']}>
          {step === 1 && (
            <DatabaseStep
              dbType = {
                dbType
              }
              dbUrl = {
                dbUrl
              }
              errors = {
                errors
              }
              onFieldChange = {
                onFieldChange
              }
            />
          )}

          {step === 2 && (
            <AdminStep
              adminUsername = {
                adminUsername
              }
              adminPassword = {
                adminPassword
              }
              adminConfirmPassword = {
                adminConfirmPassword
              }
              adminFirstName = {
                adminFirstName
              }
              adminLastName = {
                adminLastName
              }
              showPassword = {
                showPassword
              }
              showConfirmPassword = {
                showConfirmPassword
              }
              errors = {
                errors
              }
              onFieldChange = {
                onFieldChange
              }
              onToggleShowPassword = {
                onToggleShowPassword
              }
              onToggleShowConfirmPassword = {
                onToggleShowConfirmPassword
              }
            />
          )}

          {step === 3 && (
            <InstallStep
              installTasks = {
                installTasks
              }
            />
          )}

          {step === 4 && <SuccessStep />}
        </div>
      </div>

      <Footer
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
    </main>
  </div>
);
