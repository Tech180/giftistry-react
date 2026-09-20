import { ItemsSessionProvider } from 'features/items';
import { CommentsSessionProvider } from 'features/comments';
import { MobileActions } from './components/mobile-actions/mobile-actions.component';
import { PageTemplate } from './page.html';
import { usePage } from './hooks/use-page';

export default function WishlistDetail() {
  const { mobileActions, ...templateProps } = usePage();

  return (
    <ItemsSessionProvider>
      <CommentsSessionProvider>
        <MobileActions
          {...mobileActions}
        />
        <PageTemplate
          {...templateProps}
        />
      </CommentsSessionProvider>
    </ItemsSessionProvider>
  );
}
