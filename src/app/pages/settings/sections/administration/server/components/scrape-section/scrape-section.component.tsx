import React from 'react';
import type { ScrapeSectionProps } from './interfaces/props.interface';
import { UNLIMITED_CONFIRM } from './constants/unlimited-confirm.constant';
import { ScrapeSectionTemplate } from './scrape-section.html';

export type { ScrapeSectionProps };

export const ScrapeSection: React.FC<ScrapeSectionProps> = ({
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
    <ScrapeSectionTemplate
      scrapeFetchTimeoutMs = {
        scrapeFetchTimeoutMs
      }
      setScrapeFetchTimeoutMs = {
        setScrapeFetchTimeoutMs
      }
      scrapePlaywrightTimeoutMs = {
        scrapePlaywrightTimeoutMs
      }
      setScrapePlaywrightTimeoutMs = {
        setScrapePlaywrightTimeoutMs
      }
      grabInfoConcurrency = {
        grabInfoConcurrency
      }
      setGrabInfoConcurrency = {
        setGrabInfoConcurrency
      }
      grabInfoConcurrencyUnlimited = {
        grabInfoConcurrencyUnlimited
      }
      onUnlimitedChange = {
        handleUnlimitedChange
      }
      grabInfoActiveStreamLimit = {
        grabInfoActiveStreamLimit
      }
      setGrabInfoActiveStreamLimit = {
        setGrabInfoActiveStreamLimit
      }
    />
  );
};

export default ScrapeSection;
