import type { CreateUserFormState } from '../interfaces/create-user-form-state.interface';

export const INITIAL_CREATE_FORM: CreateUserFormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  isAdmin: false,
  forcePasswordChange: true,
};
