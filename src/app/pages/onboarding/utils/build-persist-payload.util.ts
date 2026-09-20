import type { StepId } from '../interfaces/step-id.type';

export interface PersistFormState {
  firstName: string;
  lastName: string;
  bio: string;
  theme: string;
  publicAppUrl: string;
  registrationMode: 'open' | 'invite_only' | 'disabled';
  smtpType: 'local' | 'remote';
  smtpHost: string;
  smtpPort: string;
  smtpFrom: string;
  aiEnabled: boolean;
  aiWebSearchEnabled: boolean;
}

export interface BuildPersistPayloadOptions {
  stepId: StepId;
  form: PersistFormState;
  isOwnerStep: boolean;
  skip?: boolean;
}

export function buildPersistPayload({
  stepId,
  form,
  isOwnerStep,
  skip,
}: BuildPersistPayloadOptions): Record<string, unknown> | null {
  if (skip && isOwnerStep) {
    return { CompleteOwner: true, SkipOwner: true };
  }

  // Owner AI completion is sent from handleNext via buildOwnerCompletePayload.
  if (stepId === 'ai' && isOwnerStep) {
    return null;
  }

  if (stepId === 'profile' || stepId === 'theme') {
    return {
      FirstName: form.firstName,
      LastName: form.lastName,
      Bio: form.bio,
      Theme: form.theme,
    };
  }

  if (stepId === 'public_url') {
    return { PublicAppUrl: form.publicAppUrl.trim() };
  }

  if (stepId === 'registration') {
    return { RegistrationMode: form.registrationMode };
  }

  if (stepId === 'mail') {
    return {
      SmtpType: form.smtpType,
      SmtpHost: form.smtpHost,
      SmtpPort: Number(form.smtpPort) || 587,
      SmtpFrom: form.smtpFrom,
    };
  }

  if (stepId === 'ai') {
    return {
      AiEnabled: form.aiEnabled,
      AiWebSearchEnabled: form.aiWebSearchEnabled,
    };
  }

  return null;
}

export function buildOwnerCompletePayload(form: PersistFormState): Record<string, unknown> {
  return {
    CompleteOwner: true,
    PublicAppUrl: form.publicAppUrl.trim(),
    RegistrationMode: form.registrationMode,
    SmtpType: form.smtpType,
    SmtpHost: form.smtpHost,
    SmtpPort: Number(form.smtpPort) || 587,
    SmtpFrom: form.smtpFrom,
    AiEnabled: form.aiEnabled,
    AiWebSearchEnabled: form.aiWebSearchEnabled,
  };
}
