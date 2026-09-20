export interface ScrapeSectionTemplateProps {
  scrapeFetchTimeoutMs: number;
  setScrapeFetchTimeoutMs: (value: number) => void;
  scrapePlaywrightTimeoutMs: number;
  setScrapePlaywrightTimeoutMs: (value: number) => void;
  grabInfoConcurrency: number;
  setGrabInfoConcurrency: (value: number) => void;
  grabInfoConcurrencyUnlimited: boolean;
  onUnlimitedChange: (checked: boolean) => void;
  grabInfoActiveStreamLimit: number;
  setGrabInfoActiveStreamLimit: (value: number) => void;
}
