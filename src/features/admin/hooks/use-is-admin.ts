import { useAuth } from 'app/providers/auth-context';

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return !!user?.IsAdmin;
}
