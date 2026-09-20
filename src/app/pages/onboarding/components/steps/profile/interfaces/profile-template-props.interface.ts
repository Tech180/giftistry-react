export interface ProfileTemplateProps {
  firstName: string;
  lastName: string;
  bio: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
}
