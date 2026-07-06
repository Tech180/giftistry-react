export interface DbSectionProps {
  dbType: 'local' | 'remote';
  setDbType: (value: 'local' | 'remote') => void;
  dbUrl: string;
  setDbUrl: (value: string) => void;
}
