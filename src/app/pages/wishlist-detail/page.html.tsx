import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { isDemoListId } from 'features/tour';
import { Button, LoadingState, ErrorState } from 'shared/ui';
import { PageTemplateProps } from './interfaces/page-template-props.interface';
import { ArchivedBanner } from './components/archived-banner/archived-banner.component';
import { Workspace } from './components/workspace/workspace.component';
import { Overlays } from './components/overlays/overlays.component';
import styles from './page.module.css';

export const PageTemplate: React.FC<PageTemplateProps> = (props) => {
  const {
    isWishlistLoading,
    wishlistError,
    onGoHome,
    wishlist,
    isPublicGuest = false,
    isArchived,
    isHighlightInteractionLocked = false,
  } = props;
  const { listId } = useParams<{ listId: string }>();
  const isDemoRoute = isDemoListId(listId);

  if (isWishlistLoading) {
    return <LoadingState message="Loading list..." fullHeight />;
  }

  // Sample list teardown: never paint the permission/404 empty state for tour-demo.
  if (isDemoRoute && !wishlist) {
    return null;
  }

  if (wishlistError || !wishlist) {
    return (
      <div
        className = {
          styles['page__error']
        }
      >
        <ErrorState
          message = {
            wishlistError || 'This wishlist does not exist or you do not have permission to view it.'
          }
        />
        <Button
          type = {
            'button'
          }
          variant = {
            'secondary'
          }
          leftIcon = {
            <ArrowLeft size={16} />
          }
          onClick = {
            onGoHome
          }
        >
          {isPublicGuest ? 'Log in' : 'Back to Dashboard'}
        </Button>
      </div>
    );
  }

  const composedProps = {
    ...props,
    wishlist,
  };

  return (
    <>
      {isArchived ? <ArchivedBanner /> : null}
      <div
        className = {
          styles['page__layout']
        }
        inert = {
          isHighlightInteractionLocked || undefined
        }
        aria-busy = {
          isHighlightInteractionLocked || undefined
        }
      >
        <Workspace
          {...composedProps}
        />
        <Overlays
          {...composedProps}
        />
      </div>
    </>
  );
};
