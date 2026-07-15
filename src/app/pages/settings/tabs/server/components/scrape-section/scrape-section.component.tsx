import React from 'react';
import { ScrapeSectionProps } from '../../interfaces/scrape-section-props.interface';
import { ScrapeSectionTemplate } from './scrape-section.html';

export const ScrapeSection: React.FC<ScrapeSectionProps> = (props) => {
  return <ScrapeSectionTemplate {...props} />;
};

export default ScrapeSection;
