import { ApiUser } from 'features/auth/interfaces/api-user.interface';

export function resolveCanShowAi(globalAiEnabled: boolean, user: ApiUser | null | undefined): boolean {
  if (!globalAiEnabled || !user) return false;
  if (user.AiEnabled === false) return false;
  if (user.Policy?.CanUseAiFeatures === false) return false;
  return true;
}

/** Account settings: show the AI toggle even when the user has opted out. */
export function resolveCanShowAiSettings(globalAiEnabled: boolean, user: ApiUser | null | undefined): boolean {
  if (!globalAiEnabled || !user) return false;
  if (user.Policy?.CanUseAiFeatures === false) return false;
  return true;
}

export function userPolicyAllowsAi(user: ApiUser | null | undefined): boolean {
  return user?.Policy?.CanUseAiFeatures !== false;
}
