import type { ApiUser } from '../interfaces/api-user.interface';
import type { PostAuthPath } from '../interfaces/post-auth-path.type';

export function postAuthPath(user: Pick<ApiUser, 'ForcePasswordChange' | 'IsOnboarded'> | null | undefined): PostAuthPath {
  if (user?.ForcePasswordChange) {
    return '/change-password';
  }

  if (user?.IsOnboarded === false) {
    return '/welcome';
  }

  return '/dashboard';
}
