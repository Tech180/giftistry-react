import React from 'react';
import { Link, Search, Wand2 } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './link-field.module.css';

export const LinkFieldTemplate: React.FC<TemplateProps> = ({
  linkUrl,
  setLinkUrl,
  onOpenLink,
  readOnly = false,
  canUseWebSearchOnList = false,
  isAutopopulating,
  isSummarizingNotes,
  handleScrapeClick,
  isScrapeButtonPulsing,
}) => (
  <div className={styles['link-field']}>
    <div className={styles['link-field__form-group']}>
      <div className={styles['link-field__label-row']}>
        <label className={styles['link-field__label']}>Item Link</label>
        {canUseWebSearchOnList && !readOnly && (
          <span
            className={styles['link-field__web-search-indicator']}
            title="Web search enabled — scrape will also search the web for specs"
            aria-label="Web search enabled for this list"
            role="img"
          >
            <Search size={14} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className={styles['link-field__input-wrapper']}>
        <button
          type="button"
          className={styles['link-field__input-icon']}
          onClick={onOpenLink}
          disabled={!linkUrl.trim()}
          title="Open link"
          aria-label="Open link in new tab"
        >
          <Link size={16} aria-hidden />
        </button>
        <fieldset
          disabled={readOnly}
          className={[
            styles['link-field__input-fieldset'],
            readOnly ? styles['link-field__input-fieldset--disabled'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <input
            type="url"
            className={[
              styles['link-field__input'],
              styles['link-field__input--has-icon'],
              readOnly
                ? styles['link-field__input--has-icon-only']
                : styles['link-field__input--has-action'],
            ]
              .filter(Boolean)
              .join(' ')}
            placeholder="Paste product URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
          />
          {!readOnly && (
            <button
              type="button"
              onClick={handleScrapeClick}
              disabled={isAutopopulating || isSummarizingNotes || !linkUrl.trim()}
              className={[
                styles['link-field__input-action'],
                isScrapeButtonPulsing ? styles['link-field__input-action--pulse'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title="Auto-fill details from link"
              aria-label="Auto-fill details from link"
            >
              <Wand2 size={14} />
            </button>
          )}
        </fieldset>
      </div>
      {!readOnly && isAutopopulating && (
        <div className={styles['link-field__autopopulate-loader']}>
          <div className={styles['link-field__spinner']} />
          <span>
            {canUseWebSearchOnList
              ? 'Fetching product details and searching the web...'
              : 'Fetching product details...'}
          </span>
        </div>
      )}
    </div>
  </div>
);
