export interface ScrapeSectionProps {
  scrapeFetchTimeoutMs: number;
  setScrapeFetchTimeoutMs: (value: number) => void;
  scrapePlaywrightTimeoutMs: number;
  setScrapePlaywrightTimeoutMs: (value: number) => void;
}
