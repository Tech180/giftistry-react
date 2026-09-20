import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Props } from './interfaces/props.interface';
import styles from './links-widget.module.css';

export const LinksWidgetTemplate: React.FC<Props> = ({ links, getSiteName }) => {
  if (!links.length) {
    return <span className={styles['links-widget__empty']}>No links yet</span>;
  }

  return (
    <div className={styles['links-widget']}>
      {links.map((link) => (
        <a
          key={link.Id}
          href={link.Url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles['links-widget__link']}
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
