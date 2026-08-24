import React from 'react';
import { Switch, Button } from 'shared/ui';
import type { PushSectionProps } from '../../interfaces/push-section-props.interface';
import styles from './push-section.module.css';

export const PushSectionTemplate: React.FC<PushSectionProps> = ({
  ntfyEnabled,
  setNtfyEnabled,
  ntfyBaseUrl,
  setNtfyBaseUrl,
  ntfyAuthToken,
  setNtfyAuthToken,
  ntfyTopicPrefix,
  setNtfyTopicPrefix,
  webPushEnabled,
  setWebPushEnabled,
  webPushVapidPublicKey,
  setWebPushVapidPublicKey,
  webPushVapidPrivateKey,
  setWebPushVapidPrivateKey,
  webPushSubject,
  setWebPushSubject,
  fcmEnabled,
  setFcmEnabled,
  fcmProjectId,
  setFcmProjectId,
  fcmServiceAccountJson,
  setFcmServiceAccountJson,
  onTestNtfy,
  isTestingNtfy,
}) => {
  return (
    <section className={styles.section}>
      <h2 className={styles['section-header']}>Push Notifications</h2>
      <div className={styles['setting-list']}>
        <div className={styles['setting-row']}>
          <div className={styles['setting-info']}>
            <span className={styles['setting-label']}>Enable ntfy</span>
            <span className={styles['setting-desc']}>
              Primary mobile push via ntfy.sh or a self-hosted ntfy server.
            </span>
          </div>
          <div className={styles['setting-action']}>
            <Switch checked={ntfyEnabled} onChange={setNtfyEnabled} aria-label="Enable ntfy" />
          </div>
        </div>

        <div
          className={`${styles['expandable-area']} ${ntfyEnabled ? styles['expandable-area-active'] : ''}`}
        >
          <div className={styles['expandable-content']}>
            <div className={styles['expandable-inner']}>
              <div className={styles['form-grid']}>
                <div className={styles['form-row']}>
                  <div className={styles['input-group']}>
                    <label className={styles['input-label']} htmlFor="ntfy-base-url">
                      Base URL
                    </label>
                    <input
                      id="ntfy-base-url"
                      type="url"
                      className={styles['input-field']}
                      placeholder="https://ntfy.sh"
                      value={ntfyBaseUrl}
                      onChange={(e) => setNtfyBaseUrl(e.target.value)}
                    />
                  </div>
                  <div className={styles['input-group']}>
                    <label className={styles['input-label']} htmlFor="ntfy-topic-prefix">
                      Topic prefix
                    </label>
                    <input
                      id="ntfy-topic-prefix"
                      type="text"
                      className={styles['input-field']}
                      placeholder="giftistry"
                      value={ntfyTopicPrefix}
                      onChange={(e) => setNtfyTopicPrefix(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles['input-wrapper']}>
                  <label className={styles['input-label']} htmlFor="ntfy-auth-token">
                    Publish token
                  </label>
                  <input
                    id="ntfy-auth-token"
                    type="password"
                    className={styles['input-field']}
                    placeholder="Bearer token"
                    value={ntfyAuthToken}
                    onChange={(e) => setNtfyAuthToken(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div className={styles['actions-row']}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={onTestNtfy}
                    isLoading={isTestingNtfy}
                  >
                    Test ntfy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['setting-row']}>
          <div className={styles['setting-info']}>
            <span className={styles['setting-label']}>Enable WebPush</span>
            <span className={styles['setting-desc']}>
              Android fallback via UnifiedPush embedded FCM distributor endpoints.
            </span>
          </div>
          <div className={styles['setting-action']}>
            <Switch
              checked={webPushEnabled}
              onChange={setWebPushEnabled}
              aria-label="Enable WebPush"
            />
          </div>
        </div>

        <div
          className={`${styles['expandable-area']} ${webPushEnabled ? styles['expandable-area-active'] : ''}`}
        >
          <div className={styles['expandable-content']}>
            <div className={styles['expandable-inner']}>
              <div className={styles['form-grid']}>
                <div className={styles['input-wrapper']}>
                  <label className={styles['input-label']} htmlFor="webpush-vapid-public">
                    VAPID public key
                  </label>
                  <input
                    id="webpush-vapid-public"
                    type="text"
                    className={styles['input-field']}
                    value={webPushVapidPublicKey}
                    onChange={(e) => setWebPushVapidPublicKey(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className={styles['input-wrapper']}>
                  <label className={styles['input-label']} htmlFor="webpush-vapid-private">
                    VAPID private key
                  </label>
                  <input
                    id="webpush-vapid-private"
                    type="password"
                    className={styles['input-field']}
                    value={webPushVapidPrivateKey}
                    onChange={(e) => setWebPushVapidPrivateKey(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className={styles['input-wrapper']}>
                  <label className={styles['input-label']} htmlFor="webpush-subject">
                    VAPID subject
                  </label>
                  <input
                    id="webpush-subject"
                    type="text"
                    className={styles['input-field']}
                    placeholder="mailto:admin@example.com"
                    value={webPushSubject}
                    onChange={(e) => setWebPushSubject(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['setting-row']}>
          <div className={styles['setting-info']}>
            <span className={styles['setting-label']}>Enable FCM</span>
            <span className={styles['setting-desc']}>
              iOS fallback via Firebase Cloud Messaging HTTP v1.
            </span>
          </div>
          <div className={styles['setting-action']}>
            <Switch checked={fcmEnabled} onChange={setFcmEnabled} aria-label="Enable FCM" />
          </div>
        </div>

        <div
          className={`${styles['expandable-area']} ${fcmEnabled ? styles['expandable-area-active'] : ''}`}
        >
          <div className={styles['expandable-content']}>
            <div className={styles['expandable-inner']}>
              <div className={styles['form-grid']}>
                <div className={styles['input-wrapper']}>
                  <label className={styles['input-label']} htmlFor="fcm-project-id">
                    Firebase project ID
                  </label>
                  <input
                    id="fcm-project-id"
                    type="text"
                    className={styles['input-field']}
                    value={fcmProjectId}
                    onChange={(e) => setFcmProjectId(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className={styles['input-wrapper']}>
                  <label className={styles['input-label']} htmlFor="fcm-service-account">
                    Service account JSON
                  </label>
                  <textarea
                    id="fcm-service-account"
                    className={styles['textarea-field']}
                    value={fcmServiceAccountJson}
                    onChange={(e) => setFcmServiceAccountJson(e.target.value)}
                    rows={5}
                    spellCheck={false}
                    aria-label="FCM service account JSON"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PushSectionTemplate;
