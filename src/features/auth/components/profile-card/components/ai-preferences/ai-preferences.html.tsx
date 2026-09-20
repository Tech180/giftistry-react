import React from 'react';
import { AiStatusBadge, Badge } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './ai-preferences.module.css';

export const AiPreferencesTemplate: React.FC<TemplateProps> = ({
  showAiBadge,
  aiEnabled,
  isAiSaving,
  onAiToggle,
  showWebSearchBadge,
  webSearchEnabled,
  isWebSearchSaving,
  onWebSearchToggle,
}) => {
  return (
    <section className={styles['ai-section']}>
      <div className={styles['ai-section-card']}>
        {showAiBadge && (
          <div className={styles['ai-section-row']}>
            <div>
              <h3 className={styles['ai-section-title']}>AI Features</h3>
              <p className={styles['ai-section-desc']}>
                Control whether AI-powered features are available on your account.
              </p>
            </div>
            <AiStatusBadge
              enabled={aiEnabled}
              onToggle={onAiToggle}
              disabled={isAiSaving}
              ariaLabelEnabled="AI features enabled on your account. Click to disable."
              ariaLabelDisabled="AI features disabled on your account. Click to enable."
            />
          </div>
        )}

        {showWebSearchBadge && (
          <>
            {showAiBadge && <div className={styles['ai-section-divider']} aria-hidden="true" />}
            <div className={styles['ai-section-row']}>
              <div>
                <h4 className={styles['ai-feature-label']}>Web Search</h4>
                <p className={styles['ai-section-desc']}>
                  Allow product scrape to search the web for specs when enabled on a wishlist.
                </p>
              </div>
              <Badge
                size="md"
                active={webSearchEnabled}
                onClick={onWebSearchToggle}
                disabled={isWebSearchSaving}
                ariaPressed={webSearchEnabled}
                ariaLabel={
                  webSearchEnabled
                    ? 'Web search enabled. Click to disable.'
                    : 'Web search disabled. Click to enable.'
                }
              >
                {webSearchEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
