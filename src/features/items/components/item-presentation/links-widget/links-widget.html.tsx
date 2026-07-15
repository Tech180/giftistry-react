import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LinksWidgetProps } from './interfaces/links-widget-props.interface';
import styles from './links-widget.module.css';

export const LinksWidget: React.FC<LinksWidgetProps> = ({ links, getSiteName }) => {
  if (!links.length) {
    return <span className={styles['empty-links']}>No links yet</span>;
  }

  return (
    <div className={styles['links-widget']}>
      {links.map((link) => (
        <a
          key={link.Id}
          href={link.Url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['link-btn']}
        >
          <span>{getSiteName(link.Url, link.RetailerName)}</span>
          <strong>
            {link.ExtractedPrice != null ? `$${link.ExtractedPrice}` : ''}{' '}
            <ArrowUpRight size={14} />
          </strong>
        </a>
      ))}
    </div>
  );
};
