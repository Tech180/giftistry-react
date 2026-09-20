import React from 'react';
import { Switch } from 'shared/ui';
import { SettingGroup, SettingItem } from '../../../components';
import type { Props } from './interfaces/props.interface';
import styles from './oauth.module.css';

export const OauthTemplate: React.FC<Props> = ({
  oauthEnabled,
  setOauthEnabled,
  oauthIssuerUrl,
  setOauthIssuerUrl,
  oauthClientId,
  setOauthClientId,
  oauthClientSecret,
  setOauthClientSecret,
  oauthButtonText,
  setOauthButtonText,
  oauthAutoRegister,
  setOauthAutoRegister,
}) => (
  <section className={styles['oauth']}>
    <h2 className={styles['oauth__header']}>Single Sign-On (OIDC)</h2>
    <SettingGroup className={styles['oauth__group']}>
      <SettingItem title="Enable OAuth login" description="Shows an SSO button on the login page.">
        <Switch
          checked={oauthEnabled}
          onChange={setOauthEnabled}
          aria-label="Enable OAuth login"
        />
      </SettingItem>
      {oauthEnabled ? (
        <>
          <SettingItem title="Issuer URL" layout="column">
            <input
              className={styles['oauth__input']}
              value={oauthIssuerUrl}
              onChange={(e) => setOauthIssuerUrl(e.target.value)}
              placeholder="https://auth.example.com"
            />
          </SettingItem>
          <SettingItem title="Client ID" layout="column">
            <input
              className={styles['oauth__input']}
              value={oauthClientId}
              onChange={(e) => setOauthClientId(e.target.value)}
            />
          </SettingItem>
          <SettingItem
            title="Client secret"
            description="Or set OAUTH_CLIENT_SECRET in the environment."
            layout="column"
          >
            <input
              type="password"
              className={styles['oauth__input']}
              value={oauthClientSecret}
              onChange={(e) => setOauthClientSecret(e.target.value)}
            />
          </SettingItem>
          <SettingItem title="Button text" layout="column">
            <input
              className={styles['oauth__input']}
              value={oauthButtonText}
              onChange={(e) => setOauthButtonText(e.target.value)}
            />
          </SettingItem>
          <SettingItem title="Auto-register new SSO users">
            <Switch
              checked={oauthAutoRegister}
              onChange={setOauthAutoRegister}
              aria-label="Auto-register new SSO users"
            />
          </SettingItem>
        </>
      ) : null}
    </SettingGroup>
  </section>
);
