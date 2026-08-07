export interface ScrapeSectionProps {
  scrapeFetchTimeoutMs: number;
  setScrapeFetchTimeoutMs: (value: number) => void;
  scrapePlaywrightTimeoutMs: number;
  setScrapePlaywrightTimeoutMs: (value: number) => void;
  grabInfoConcurrency: number;
  setGrabInfoConcurrency: (value: number) => void;
  grabInfoConcurrencyUnlimited: boolean;
  setGrabInfoConcurrencyUnlimited: (value: boolean) => void;
  grabInfoActiveStreamLimit: number;
  setGrabInfoActiveStreamLimit: (value: number) => void;
}
