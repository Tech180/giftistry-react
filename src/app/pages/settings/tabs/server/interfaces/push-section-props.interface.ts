export interface PushSectionProps {
  ntfyEnabled: boolean;
  setNtfyEnabled: (value: boolean) => void;
  ntfyBaseUrl: string;
  setNtfyBaseUrl: (value: string) => void;
  ntfyAuthToken: string;
  setNtfyAuthToken: (value: string) => void;
  ntfyTopicPrefix: string;
  setNtfyTopicPrefix: (value: string) => void;
  webPushEnabled: boolean;
  setWebPushEnabled: (value: boolean) => void;
  webPushVapidPublicKey: string;
  setWebPushVapidPublicKey: (value: string) => void;
  webPushVapidPrivateKey: string;
  setWebPushVapidPrivateKey: (value: string) => void;
  webPushSubject: string;
  setWebPushSubject: (value: string) => void;
  fcmEnabled: boolean;
  setFcmEnabled: (value: boolean) => void;
  fcmProjectId: string;
  setFcmProjectId: (value: string) => void;
  fcmServiceAccountJson: string;
  setFcmServiceAccountJson: (value: string) => void;
  onTestNtfy: () => void;
  isTestingNtfy: boolean;
}
