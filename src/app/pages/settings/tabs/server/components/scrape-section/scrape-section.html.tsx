import React from 'react';
import { Timer } from 'lucide-react';
import { ScrapeSectionProps } from '../../interfaces/scrape-section-props.interface';
import styles from './scrape-section.module.css';

export const ScrapeSectionTemplate: React.FC<ScrapeSectionProps> = ({
  scrapeFetchTimeoutMs,
  setScrapeFetchTimeoutMs,
  scrapePlaywrightTimeoutMs,
  setScrapePlaywrightTimeoutMs,
}) => {
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
    </section>
  );
};

export default ScrapeSectionTemplate;
