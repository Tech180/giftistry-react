import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SettingGroup, SettingItem } from '../../../components';
import type { Props } from './interfaces/props.interface';
import styles from './giphy-section.module.css';

export const GiphySectionTemplate: React.FC<Props> = ({
  giphyApiKey,
  setGiphyApiKey,
  showGiphyApiKey,
  setShowGiphyApiKey,
}) => (
  <section className={styles.section}>
    <h2 className={styles.header}>GIFs</h2>
    <SettingGroup className={styles.group}>
      <SettingItem
        title="GIPHY"
        description={
          <>
            Required for GIF search in comments. Create a key at{' '}
            <a
              href="https://developers.giphy.com/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              developers.giphy.com
            </a>
            .
          </>
        }
        layout="column"
      >
        <div className={styles.inputBox}>
          <input
            type={showGiphyApiKey ? 'text' : 'password'}
            className={styles.inputField}
            placeholder="API key"
            value={giphyApiKey}
            onChange={(e) => setGiphyApiKey(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className={styles.inputIconBtn}
            onClick={() => setShowGiphyApiKey(!showGiphyApiKey)}
            aria-label={showGiphyApiKey ? 'Hide API key' : 'Show API key'}
          >
            {showGiphyApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </SettingItem>
    </SettingGroup>
  </section>
);
