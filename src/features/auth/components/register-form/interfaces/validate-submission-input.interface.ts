export interface ValidateSubmissionInput {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  requireStrongPasswords: boolean;
}
