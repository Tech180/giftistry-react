export interface DatabaseStepProps {
  dbType: 'local' | 'remote';
  dbUrl: string;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: unknown) => void;
}
