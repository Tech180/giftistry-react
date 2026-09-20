export interface ValidateStepFields {
  dbType: 'local' | 'remote';
  dbUrl: string;
  adminUsername: string;
  adminPassword: string;
  adminConfirmPassword: string;
  adminFirstName: string;
  adminLastName: string;
}
