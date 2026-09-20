import React from 'react';
import { Search, Gauge, Layers } from 'lucide-react';
import { Switch } from 'shared/ui';
import type { FeatureTogglesTemplateProps } from './interfaces/template-props.interface';
import styles from './feature-toggles.module.css';

export const FeatureTogglesTemplate: React.FC<FeatureTogglesTemplateProps> = ({
  aiEnabled,
  aiWebSearchEnabled,
  setAiWebSearchEnabled,
  aiRateLimitEnabled,
  setAiRateLimitEnabled,
  aiImportChunkingEnabled,
  setAiImportChunkingEnabled,
  aiImportChunkItemLimit,
  setAiImportChunkItemLimit,
}) => (
  <div className={styles['feature-toggles']}>
    <div className={styles['feature-toggles__row']}>
      <div className={styles['feature-toggles__copy']}>
        <div className={styles['feature-toggles__icon']} aria-hidden="true">
          <Search size={14} />
        </div>
        <div>
          <h3 className={styles['feature-toggles__title']}>Web Search</h3>
          <p className={styles['feature-toggles__subtitle']}>
            Augment product scrape with web research and AI reconcile when adding items.
          </p>
        </div>
      </div>
      <Switch
        checked={aiWebSearchEnabled}
        onChange={setAiWebSearchEnabled}
        disabled={!aiEnabled}
        aria-label="Enable web search for product scrape"
      />
    </div>

    <div className={styles['feature-toggles__row']}>
      <div className={styles['feature-toggles__copy']}>
        <div className={styles['feature-toggles__icon']} aria-hidden="true">
          <Gauge size={14} />
        </div>
        <div>
          <h3 className={styles['feature-toggles__title']}>Rate Limiting</h3>
          <p className={styles['feature-toggles__subtitle']}>
            Limit AI request frequency to protect provider quotas and local resources.
          </p>
        </div>
      </div>
      <Switch
        checked={aiRateLimitEnabled}
        onChange={setAiRateLimitEnabled}
        disabled={!aiEnabled}
        aria-label="Enable AI rate limiting"
      />
    </div>

    <div className={styles['feature-toggles__row']}>
      <div className={styles['feature-toggles__copy']}>
        <div className={styles['feature-toggles__icon']} aria-hidden="true">
          <Layers size={14} />
        </div>
        <div>
          <h3 className={styles['feature-toggles__title']}>Import chunking</h3>
          <p className={styles['feature-toggles__subtitle']}>
            Split large wishlist imports into smaller AI requests for more reliable extraction.
          </p>
        </div>
      </div>
      <Switch
        checked={aiImportChunkingEnabled}
        onChange={setAiImportChunkingEnabled}
        disabled={!aiEnabled}
        aria-label="Enable AI import chunking"
      />
    </div>

    {aiImportChunkingEnabled ? (
      <div className={styles['feature-toggles__field']}>
        <label className={styles['feature-toggles__label']} htmlFor="ai-import-chunk-item-limit">
          Items per import chunk
        </label>
        <p className={styles['feature-toggles__subtitle']}>
          Maximum candidate rows sent to the AI in each import chunk (1–100).
        </p>
        <input
          id="ai-import-chunk-item-limit"
          type="number"
          min={1}
          max={100}
          step={1}
          className={styles['feature-toggles__input']}
          value={aiImportChunkItemLimit}
          onChange={(e) => setAiImportChunkItemLimit(Number(e.target.value))}
          disabled={!aiEnabled}
          aria-label="Items per AI import chunk"
        />
      </div>
    ) : null}
  </div>
);

export default FeatureTogglesTemplate;
