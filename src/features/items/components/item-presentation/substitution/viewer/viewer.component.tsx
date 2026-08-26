import React from 'react';
import { Modal } from 'shared/ui';
import { SubstitutionBadge } from '../badge/badge.component';
import type { SubstitutionViewerProps } from './interfaces/substitution-viewer-props.interface';
import styles from './viewer.module.css';

export type { SubstitutionViewerProps } from './interfaces/substitution-viewer-props.interface';

export const SubstitutionViewer: React.FC<SubstitutionViewerProps> = ({
  isOpen,
  onClose,
  option,
}) => {
  if (!option) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Substitution">
      <div className={styles.viewer}>
        <SubstitutionBadge
          kind={option.Kind}
          createdByUserId={option.CreatedByUserId}
        />
        <h3 className={styles.name}>{option.Item.Name}</h3>
        {option.Item.Description ? (
          <p className={styles.description}>{option.Item.Description}</p>
        ) : null}
        {option.Item.Links?.length ? (
          <ul className={styles.links}>
            {option.Item.Links.map((link: { Id: string; Url: string; RetailerName: string | null }) => (
              <li key={link.Id}>
                <a
                  className={styles.link}
                  href={link.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.RetailerName || link.Url}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Modal>
  );
};
