import { useEffect, useRef, useState } from 'react';
import { authApi } from 'features/auth';
import { isDemoListId } from 'features/tour';
import { wishlistsApi } from 'features/wishlists';
import type { ListParticipant } from '../../../interfaces/list-participant.interface';
import { buildOwnerParticipant } from '../../../utils/build-owner-participant.util';
import { mergeParticipantUpdates } from '../../../utils/merge-participant-updates.util';
import type { UseParticipantsParams } from '../interfaces/use-participants-params.interface';
import type { UseParticipantsResult } from '../interfaces/use-participants-result.interface';

export function useParticipants({
  listId,
  listOwnerId,
  ownerUsername,
  ownerDisplayName,
  isAuthenticated,
  currentUserId,
  currentUserAvatar,
  comments,
}: UseParticipantsParams): UseParticipantsResult {
  const [participants, setParticipants] = useState<ListParticipant[]>([]);
  const fetchedAvatarsRef = useRef<Set<string>>(new Set());
  const participantsRef = useRef<ListParticipant[]>([]);
  const isDemo = isDemoListId(listId);

  participantsRef.current = participants;

  useEffect(() => {
    fetchedAvatarsRef.current.clear();
  }, [listId]);

  useEffect(() => {
    if (!isAuthenticated || isDemo) {
      setParticipants([]);
      return;
    }

    const loadParticipants = async () => {
      const participantMap = new Map<string, ListParticipant>();

      if (listOwnerId && ownerUsername) {
        participantMap.set(
          listOwnerId,
          buildOwnerParticipant(
            listOwnerId,
            ownerUsername,
            ownerDisplayName,
            currentUserId,
            currentUserAvatar,
          ),
        );
      }

      try {
        const shares = await wishlistsApi.listShares(listId);

        for (const share of shares || []) {
          if (!share.UserId || !share.Username) {
            continue;
          }

          participantMap.set(share.UserId, {
            userId: share.UserId,
            username: share.Username,
            displayName: share.FirstName
              ? `${share.FirstName} ${share.LastName || ''}`.trim()
              : share.Username,
            avatar: share.Avatar ?? null,
            role: share.Role,
          });
        }
      } catch {
        // Fall back to owner-only list when share lookup fails.
      }

      setParticipants(Array.from(participantMap.values()));
    };

    void loadParticipants();
  }, [
    listId,
    listOwnerId,
    ownerUsername,
    ownerDisplayName,
    isAuthenticated,
    currentUserId,
    currentUserAvatar,
    isDemo,
  ]);

  useEffect(() => {
    if (!isAuthenticated || isDemo || comments.length === 0) {
      return;
    }

    const authorIds = [
      ...new Set(comments.map((c) => c.UserId).filter((id): id is string => !!id)),
    ];

    const needsFetch = authorIds.filter((id) => {
      if (fetchedAvatarsRef.current.has(id)) {
        return false;
      }

      const existing = participantsRef.current.find((p) => p.userId === id);
      return !existing?.avatar;
    });

    if (needsFetch.length === 0) {
      return;
    }

    let cancelled = false;

    (async () => {
      const updates: ListParticipant[] = [];

      for (const userId of needsFetch) {
        fetchedAvatarsRef.current.add(userId);

        try {
          const res = await authApi.getUserPreview(userId);

          if (!res?.User) {
            continue;
          }

          const profile = res.User;
          updates.push({
            userId,
            username: profile.Username,
            displayName: profile.FirstName
              ? `${profile.FirstName} ${profile.LastName || ''}`.trim()
              : profile.Username,
            avatar: profile.Avatar ?? null,
          });
        } catch {
          // Preview unavailable — keep username fallback from comment data.
        }
      }

      if (!cancelled && updates.length > 0) {
        setParticipants((prev) => mergeParticipantUpdates(prev, updates));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [comments, isAuthenticated, isDemo]);

  return { participants };
}
