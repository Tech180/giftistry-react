import React from 'react';
import { Switch } from 'shared/ui';
import { GlowCard } from '../../glow-card/glow-card.component';
import { StaggerItem } from '../../step-panel/stagger-item.component';
import type { AiTemplateProps } from './interfaces/ai-template-props.interface';
import styles from './ai.module.css';

export const AiTemplate: React.FC<AiTemplateProps> = ({
  aiEnabled,
  aiWebSearchEnabled,
  onAiEnabledChange,
  onAiWebSearchEnabledChange,
  onGlowMove,
}) => (
  <div className={styles['ai']}>
    <StaggerItem>
      <GlowCard as="div" onMouseMove={onGlowMove} role="group" contentPassive={false}>
        <div className={styles['ai__toggle']}>
          <div className={styles['ai__copy']}>
            <div className={styles['ai__title']}>Enable AI Assistants</div>
            <div className={styles['ai__desc']}>
              Allow users to generate gift ideas using integrated Large Language Models.
            </div>
          </div>
          <Switch
            checked={aiEnabled}
            onChange={onAiEnabledChange}
            aria-label="Enable AI Assistants"
          />
        </div>
      </GlowCard>
    </StaggerItem>

    <StaggerItem>
      <GlowCard as="div" onMouseMove={onGlowMove} role="group" contentPassive={false}>
        <div className={styles['ai__toggle']}>
          <div className={styles['ai__copy']}>
            <div className={styles['ai__title']}>Real-time Web Search</div>
            <div className={styles['ai__desc']}>
              Permit the AI to scrape live product pricing and availability.
            </div>
          </div>
          <Switch
            checked={aiWebSearchEnabled}
            onChange={onAiWebSearchEnabledChange}
            aria-label="Real-time Web Search"
          />
        </div>
      </GlowCard>
    </StaggerItem>
  </div>
);
