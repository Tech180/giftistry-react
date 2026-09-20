import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { authApi } from '../../api/auth.api';
import type { ApiUser } from '../../interfaces/api-user.interface';
import { useAuth } from '../../providers';
import type { Props } from './interfaces/props.interface';
import { PreviewCardTemplate } from './preview-card.html';
import styles from './preview-card.module.css';
import { useTheme } from 'app/providers/theme';
import { getFallbackInitials } from './utils/get-fallback-initials.util';
import { getJoinedDate } from './utils/get-joined-date.util';
import { getUserInitials } from './utils/get-user-initials.util';

const previewCache: Record<string, ApiUser> = {};

export const PreviewCard: React.FC<Props> = ({
  userId,
  displayName,
  children,
  isOnline = false,
  fallbackUser,
}) => {
  const { user: currentUser } = useAuth();
  const [userPreview, setUserPreview] = useState<ApiUser | null>(null);
  const [isDisabledUser, setIsDisabledUser] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({
    position: 'absolute',
    opacity: 0,
    zIndex: 9999,
  });

  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (leftPos < 20) {
        leftPos = 20;
      }

      setCardStyle({
        position: 'absolute',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        zIndex: 9999,
        opacity: 1,
      });
    }
  }, [isVisible, userPreview, isLoading]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const cached = previewCache[userId];
    if (cached?.IsDisabled) {
      setIsDisabledUser(true);
    }
  }, [userId]);

  if (!userId) {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    if (isDisabledUser) {
      return;
    }

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(async () => {
      if (currentUser && userId === currentUser.Id) {
        setUserPreview(currentUser as unknown as ApiUser);
        setIsVisible(true);
        return;
      }

      if (previewCache[userId]) {
        if (previewCache[userId].IsDisabled) {
          setIsDisabledUser(true);
          return;
        }
        setUserPreview(previewCache[userId]);
        setIsVisible(true);
        return;
      }

      setIsLoading(true);
      setIsVisible(true);

      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCardStyle((prev) => ({
          ...prev,
          top: `${rect.bottom + 12 + window.scrollY}px`,
          left: `${rect.left - 16 + window.scrollX}px`,
          opacity: 0,
        }));
      }

      try {
        const res = await authApi.getUserPreview(userId);
        if (res?.User) {
          previewCache[userId] = res.User;
          if (res.User.IsDisabled) {
            setIsDisabledUser(true);
            setIsVisible(false);
            return;
          }
          setUserPreview(res.User);
        }
      } catch (err) {
        console.error('Failed to fetch user preview:', err);
        setIsVisible(false);
      } finally {
        setIsLoading(false);
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

  const activeUser =
    currentUser && userId === currentUser.Id
      ? (currentUser as unknown as ApiUser)
      : userPreview
        ? {
            ...userPreview,
            Avatar: userPreview.Avatar ?? fallbackUser?.Avatar,
          }
        : fallbackUser
          ? { ...fallbackUser, Id: userId }
          : null;

  const { tryTheme } = useTheme();

  const handleTryTheme = (themeId: string) => {
    if (activeUser && activeUser.Username) {
      tryTheme(themeId, activeUser.Username);
    }
  };

  const userInitials = activeUser ? getUserInitials(activeUser) : undefined;
  const fallbackInitials = getFallbackInitials(displayName);
  const joinedDate = activeUser && activeUser.CreatedAt ? getJoinedDate(activeUser.CreatedAt) : 'Unknown Join Date';
  const cardClass = styles['preview-card'];

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={isDisabledUser ? undefined : handleMouseEnter}
        onMouseLeave={isDisabledUser ? undefined : handleMouseLeave}
        className={isDisabledUser ? styles['preview-card__disabled-trigger'] : 'hoverable-name-trigger'}
        style={{ display: 'inline-flex' }}
        title={isDisabledUser ? 'Account unavailable' : undefined}
      >
        {children}
        {isDisabledUser && (
          <span className={styles['preview-card__unavailable']}>Account unavailable</span>
        )}
      </span>
      {!isDisabledUser &&
        isVisible &&
        ReactDOM.createPortal(
          <PreviewCardTemplate
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
            onTryTheme={handleTryTheme}
          />,
          document.body
        )}
    </>
  );
};
