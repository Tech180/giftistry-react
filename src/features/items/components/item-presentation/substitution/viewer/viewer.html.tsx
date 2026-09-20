import React from 'react';
import { Badge } from '../badge/badge.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './viewer.module.css';

export const ViewerTemplate: React.FC<TemplateProps> = ({
  kind,
  createdByUserId,
  name,
  description,
  links,
}) => {
  return (
    <div className={styles.viewer}>
      <Badge
        kind = {
          kind
        }
        createdByUserId = {
          createdByUserId
        }
      />
      <h3 className={styles.name}>{name}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {links.length > 0 ? (
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.id}>
              <a
                className={styles.link}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
