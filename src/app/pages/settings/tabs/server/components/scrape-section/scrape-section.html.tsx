import React from 'react';
import { Layers, Timer } from 'lucide-react';
import { Switch } from 'shared/ui';
import { ScrapeSectionProps } from '../../interfaces/scrape-section-props.interface';
import styles from './scrape-section.module.css';

const UNLIMITED_CONFIRM =
  'Unlimited Grab info concurrency will scrape every remaining product URL at once. This can overwhelm your server, trigger retailer rate limits or blocks, and use a lot of CPU/memory (especially with browser scraping). Continue?';

export const ScrapeSectionTemplate: React.FC<ScrapeSectionProps> = ({
  scrapeFetchTimeoutMs,
  setScrapeFetchTimeoutMs,
  scrapePlaywrightTimeoutMs,
  setScrapePlaywrightTimeoutMs,
  grabInfoConcurrency,
  setGrabInfoConcurrency,
  grabInfoConcurrencyUnlimited,
  setGrabInfoConcurrencyUnlimited,
  grabInfoActiveStreamLimit,
  setGrabInfoActiveStreamLimit,
}) => {
  const handleUnlimitedChange = (checked: boolean) => {
    if (!checked) {
      setGrabInfoConcurrencyUnlimited(false);
      return;
    }
    if (!window.confirm(UNLIMITED_CONFIRM)) {
      return;
    }
    setGrabInfoConcurrencyUnlimited(true);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles['section-header']}>Scraping Settings</h2>
      <div className={styles['setting-list']}>
        <div className={styles['card-header']}>
          <div className={styles['header-left']}>
            <div className={styles['icon-container']} aria-hidden="true">
              <Timer size={16} />
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
          <div className={styles['timeouts-grid']}>
            <div className={styles['input-wrapper']}>
              <label className={styles['input-label']} htmlFor="scrape-fetch-timeout-ms">
                Fetch timeout (ms)
              </label>
              <input
                id="scrape-fetch-timeout-ms"
                type="number"
                min={1000}
                max={60000}
                step={500}
                className={styles['input-field']}
                value={scrapeFetchTimeoutMs}
                onChange={(e) => setScrapeFetchTimeoutMs(Number(e.target.value))}
                aria-label="Fetch scrape timeout in milliseconds"
              />
            </div>
            <div className={styles['input-wrapper']}>
              <label className={styles['input-label']} htmlFor="scrape-playwright-timeout-ms">
                Playwright timeout (ms)
              </label>
              <input
                id="scrape-playwright-timeout-ms"
                type="number"
                min={1000}
                max={120000}
                step={1000}
                className={styles['input-field']}
                value={scrapePlaywrightTimeoutMs}
                onChange={(e) => setScrapePlaywrightTimeoutMs(Number(e.target.value))}
                aria-label="Playwright scrape timeout in milliseconds"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles['setting-list']}>
        <div className={styles['card-header']}>
          <div className={styles['header-left']}>
            <div className={styles['icon-container']} aria-hidden="true">
              <Layers size={16} />
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
          <div className={styles['timeouts-grid']}>
            <div className={styles['input-wrapper']}>
              <label className={styles['input-label']} htmlFor="grab-info-concurrency">
                Concurrent grab workers
              </label>
              <input
                id="grab-info-concurrency"
                type="number"
                min={1}
                max={1000}
                step={1}
                className={styles['input-field']}
                value={grabInfoConcurrency}
                disabled={grabInfoConcurrencyUnlimited}
                onChange={(e) => setGrabInfoConcurrency(Number(e.target.value))}
                aria-label="Concurrent Grab info workers"
              />
            </div>
            <div className={styles['input-wrapper']}>
              <label className={styles['input-label']} htmlFor="grab-info-stream-limit">
                Max visible stream lanes
              </label>
              <input
                id="grab-info-stream-limit"
                type="number"
                min={1}
                max={1000}
                step={1}
                className={styles['input-field']}
                value={grabInfoActiveStreamLimit}
                onChange={(e) => setGrabInfoActiveStreamLimit(Number(e.target.value))}
                aria-label="Max visible Grab info stream lanes"
              />
            </div>
          </div>

          <div className={styles['unlimited-row']}>
            <div>
              <h4 className={styles['unlimited-title']}>Unlimited concurrency</h4>
              <p className={styles.subtitle}>
                Scrape every remaining Grab info URL at once.
              </p>
            </div>
            <Switch
              id="grab-info-concurrency-unlimited"
              checked={grabInfoConcurrencyUnlimited}
              onChange={handleUnlimitedChange}
              aria-label="Unlimited Grab info concurrency"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrapeSectionTemplate;
