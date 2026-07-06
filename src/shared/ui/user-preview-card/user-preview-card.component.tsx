import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { authApi, ApiUser } from 'features/auth';
import { UserPreviewCardProps } from './interfaces/user-preview-card-props.interface';
import { UserPreviewCardTemplate } from './user-preview-card.html';
import styles from './user-preview-card.module.css';
import { getFallbackInitials, getJoinedDate, getUserInitials } from './utils/user-preview-card.utils';

// In-memory cache to prevent repeated fetches for the same user
const previewCache: Record<string, ApiUser> = {};

export const UserPreviewCard: React.FC<UserPreviewCardProps> = ({
  userId,
  displayName,
  children,
  isOnline = false,
  fallbackUser,
}) => {
  const [userPreview, setUserPreview] = useState<ApiUser | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({
    position: 'absolute',
    opacity: 0, // start invisible to avoid flash before measuring
    zIndex: 9999,
  });
  
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const showTimeoutRef = useRef<any>(null);
  const hideTimeoutRef = useRef<any>(null);

  // Measure card and position it correctly relative to trigger
  useEffect(() => {
    if (isVisible && cardRef.current && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const cardHeight = cardRef.current.offsetHeight;
      const cardWidth = cardRef.current.offsetWidth;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const isTopPlacement = spaceBelow < cardHeight + 20 && spaceAbove > spaceBelow;
      setPlacement(isTopPlacement ? 'top' : 'bottom');

      let topPos = 0;
      if (isTopPlacement) {
        topPos = rect.top - cardHeight - 12 + window.scrollY;
      } else {
        topPos = rect.bottom + 12 + window.scrollY;
      }

      let leftPos = rect.left - 16 + window.scrollX;
      if (rect.left + cardWidth > window.innerWidth - 20) {
        leftPos = window.innerWidth - cardWidth - 20 + window.scrollX;
      }
      if (leftPos < 20) leftPos = 20;

      setCardStyle({
        position: 'absolute',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        zIndex: 9999,
        opacity: 1, // make visible now that position is set
      });
    }
  }, [isVisible, userPreview, isLoading]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  if (!userId) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(async () => {
      setIsVisible(true);
      
      // Initialize with trigger position estimate, but opacity 0
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCardStyle(prev => ({
          ...prev,
          top: `${rect.bottom + 12 + window.scrollY}px`,
          left: `${rect.left - 16 + window.scrollX}px`,
          opacity: 0,
        }));
      }

      if (previewCache[userId]) {
        setUserPreview(previewCache[userId]);
      } else {
        setIsLoading(true);
        try {
          const res = await authApi.getUserPreview(userId);
          if (res?.User) {
            previewCache[userId] = res.User;
            setUserPreview(res.User);
          }
        } catch (err) {
          console.error('Failed to fetch user preview:', err);
        } finally {
          setIsLoading(false);
        }
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 250);
  };

  const handleCardMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleCardMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 250);
  };

  const activeUser: (Partial<ApiUser> & { Id: string }) | null =
    userPreview || (fallbackUser ? { ...fallbackUser, Id: userId } : null);

  const userInitials = activeUser ? getUserInitials(activeUser) : undefined;
  const fallbackInitials = getFallbackInitials(displayName);
  const joinedDate = activeUser && activeUser.CreatedAt ? getJoinedDate(activeUser.CreatedAt) : 'Unknown Join Date';
  const cardClass = `${styles['user-profile-card']} ${
    placement === 'top' ? styles['show-top'] : styles['show-bottom']
  } ${styles['is-visible']}`;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hoverable-name-trigger"
      >
        {children}
      </span>
      {isVisible &&
        ReactDOM.createPortal(
          <UserPreviewCardTemplate
            ref={cardRef}
            user={activeUser}
            isLoading={isLoading}
            placement={placement}
            style={cardStyle}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
            displayName={displayName}
            isOnline={isOnline}
            userInitials={userInitials}
            fallbackInitials={fallbackInitials}
            joinedDate={joinedDate}
            cardClass={cardClass}
          />,
          document.body
        )}
    </>
  );
};
