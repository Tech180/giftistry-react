export interface UseDbSettingsResult {
  dbType: 'local' | 'remote';
  setDbType: (type: 'local' | 'remote') => void;
  dbUrl: string;
  setDbUrl: (url: string) => void;
  publicAppUrl: string;
  setPublicAppUrl: (url: string) => void;
}
