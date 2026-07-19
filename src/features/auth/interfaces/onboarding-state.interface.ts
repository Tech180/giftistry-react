export interface OnboardingState {
  IsOnboarded?: boolean;
  OwnerOnboardingCompleted?: boolean;
  RequiresOwnerOnboarding?: boolean;
  IsAdmin?: boolean;
  UserSteps?: string[];
  OwnerSteps?: string[];
}

export interface OnboardingPatchPayload {
  SkipStep?: string;
  CompleteUser?: boolean;
  CompleteOwner?: boolean;
  SkipOwner?: boolean;
  Username?: string;
  FirstName?: string;
  LastName?: string;
  Bio?: string;
  Theme?: string;
  PublicAppUrl?: string;
  RegistrationMode?: 'open' | 'invite_only' | 'disabled';
  SmtpType?: 'local' | 'remote';
  SmtpHost?: string;
  SmtpPort?: number;
  SmtpUser?: string;
  SmtpPass?: string;
  SmtpSecure?: boolean;
  SmtpFrom?: string;
  AiEnabled?: boolean;
  AiWebSearchEnabled?: boolean;
}
