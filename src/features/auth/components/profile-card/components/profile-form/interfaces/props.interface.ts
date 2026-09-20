import type { SyntheticEvent } from 'react';

export interface Props {
  username: string;
  setUsername: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  email: string;
  isLoading: boolean;
  hasChanges: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
}
