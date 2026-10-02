import React from 'react';
import { Timer, Layers } from 'lucide-react';
import { Switch, NumberSelector } from 'shared/ui';
import type { ScrapeSectionTemplateProps } from './interfaces/template-props.interface';
import styles from './scrape-section.module.css';

export const ScrapeSectionTemplate: React.FC<ScrapeSectionTemplateProps> = ({
  scrapeFetchTimeoutMs,
  setScrapeFetchTimeoutMs,
  scrapePlaywrightTimeoutMs,
  setScrapePlaywrightTimeoutMs,
  grabInfoConcurrency,
  setGrabInfoConcurrency,
  grabInfoActiveStreamLimit,
  setGrabInfoActiveStreamLimit,
  grabInfoConcurrencyUnlimited,
  onUnlimitedChange,
}) => (
  <section className={styles.section}>
    <div className={styles['setting-list']}>
      <div className={styles['card-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-container']} aria-hidden="true">
            <Timer size={16} className={styles.icon} />
          </div>
          <div>
            <h3 className={styles.title}>Product scrape timeouts</h3>
            <p className={styles.subtitle}>
              How long fetch and browser scrapers wait before failing a product URL.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles['field-list']}>
          <div className={styles['field-row']}>
            <div className={styles['field-info']}>
              <label className={styles['input-label']}>Fetch timeout (ms)</label>
              <p className={styles.subtitle}>
                Timeout for HTTP GET requests when fetching product web pages.
              </p>
            </div>
            <NumberSelector
              value={scrapeFetchTimeoutMs}
              min={1000}
              max={60000}
              onChange={setScrapeFetchTimeoutMs}
              editLabel="Fetch scrape timeout in milliseconds"
              decreaseLabel="Decrease fetch scrape timeout"
              increaseLabel="Increase fetch scrape timeout"
            />
          </div>
          <div className={styles['field-row']}>
            <div className={styles['field-info']}>
              <label className={styles['input-label']}>Playwright timeout (ms)</label>
              <p className={styles.subtitle}>
                Timeout for browser automation when rendering JavaScript-heavy pages.
              </p>
            </div>
            <NumberSelector
              value={scrapePlaywrightTimeoutMs}
              min={1000}
              max={120000}
              onChange={setScrapePlaywrightTimeoutMs}
              editLabel="Playwright scrape timeout in milliseconds"
              decreaseLabel="Decrease Playwright scrape timeout"
              increaseLabel="Increase Playwright scrape timeout"
            />
          </div>
        </div>
      </div>
    </div>

    <div className={styles['setting-list']}>
      <div className={styles['card-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-container']} aria-hidden="true">
            <Layers size={16} className={styles.icon} />
          </div>
          <div>
            <h3 className={styles.title}>Grab info parallelism</h3>
            <p className={styles.subtitle}>
              How many product URLs Grab info scrapes at once during import, and how many
              appear in the timeline.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles['field-list']}>
          <div className={styles['field-row']}>
            <div className={styles['field-info']}>
              <label className={styles['input-label']}>Concurrent grab workers</label>
              <p className={styles.subtitle}>
                Number of parallel scraper workers executing product metadata extraction.
              </p>
            </div>
            <NumberSelector
              value={grabInfoConcurrency}
              min={1}
              max={1000}
              onChange={setGrabInfoConcurrency}
              disabled={grabInfoConcurrencyUnlimited}
              editLabel="Concurrent Grab info workers"
              decreaseLabel="Decrease concurrent Grab info workers"
              increaseLabel="Increase concurrent Grab info workers"
            />
          </div>
          <div className={styles['field-row']}>
            <div className={styles['field-info']}>
              <label className={styles['input-label']}>Max visible stream lanes</label>
              <p className={styles.subtitle}>
                Maximum number of active item progress lanes shown in the timeline simultaneously.
              </p>
            </div>
            <NumberSelector
              value={grabInfoActiveStreamLimit}
              min={1}
              max={1000}
              onChange={setGrabInfoActiveStreamLimit}
              editLabel="Max visible Grab info stream lanes"
              decreaseLabel="Decrease max visible Grab info stream lanes"
              increaseLabel="Increase max visible Grab info stream lanes"
            />
          </div>
        </div>

        <div className={styles['unlimited-row']}>
          <div className={styles['unlimited-info']}>
            <h4 className={styles['unlimited-title']}>Unlimited concurrency</h4>
            <p className={styles.subtitle}>
              Scrape every remaining Grab info URL at once.
            </p>
          </div>
          <Switch
            id="grab-info-concurrency-unlimited"
            checked={grabInfoConcurrencyUnlimited}
            onChange={onUnlimitedChange}
            aria-label="Unlimited Grab info concurrency"
          />
        </div>
      </div>
    </div>
  </section>
);

export default ScrapeSectionTemplate;
