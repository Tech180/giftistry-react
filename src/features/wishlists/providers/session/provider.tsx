import type { Props } from './interfaces/provider-props.interface';
import { useAuth } from 'features/auth';
import { WishlistSessionContext } from './context';

export function WishlistSessionProvider({ children }: Props) {
  const { user, canShowAi, canShowWebSearch } = useAuth();

  return (
    <WishlistSessionContext.Provider
      value = {
        { user, canShowAi, canShowWebSearch }
      }
    >
      {children}
    </WishlistSessionContext.Provider>
  );
}
