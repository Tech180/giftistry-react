import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, useAuth, type TourChapterStatus } from 'features/auth';
import { isWelcomeEnabled, TOUR_CHAPTERS, useTourOptional } from 'features/tour';
import { useToast } from 'shared/providers/toast';
import type { ChapterRow } from './interfaces/chapter-row.interface';
import { TutorialTemplate } from './tutorial.html';

export const Tutorial: React.FC = () => {
  const { user, canShowAi, refreshUser } = useAuth();
  const tour = useTourOptional();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isBusy, setIsBusy] = useState(false);
  const [isWelcomeSaving, setIsWelcomeSaving] = useState(false);

  const welcomeEnabled = isWelcomeEnabled(user?.Tour);

  const chapters = useMemo((): ChapterRow[] => {
    return TOUR_CHAPTERS.filter((chapter) => {
      if (chapter.id === 'importAi' && !canShowAi) {
        return false;
      }

      return true;
    }).map((chapter) => {
      const status: TourChapterStatus = user?.Tour?.Chapters?.[chapter.id] ?? 'pending';
      return {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description,
        status,
      };
    });
  }, [user?.Tour, canShowAi]);

  const run = async (action: () => Promise<void>, goDashboard = true) => {
    if (!tour || isBusy) {
      return;
    }

    setIsBusy(true);
    try {
      await action();
      await refreshUser();
      if (goDashboard) {
        navigate('/dashboard');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const onWelcomeEnabledChange = async (enabled: boolean) => {
    if (!tour || isBusy || isWelcomeSaving) {
      return;
    }

    setIsWelcomeSaving(true);
    try {
      if (enabled) {
        await tour.reenableWelcome();
        showToast('Welcome will show again.', 'success');
      } else {
        await tour.dismissWelcome();
        showToast('Welcome disabled.', 'success');
      }
      await refreshUser();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update welcome preference.', 'error');
    } finally {
      setIsWelcomeSaving(false);
    }
  };

  return (
    <TutorialTemplate
      chapters = {
        chapters
      }
      isBusy = {
        isBusy
      }
      welcomeEnabled = {
        welcomeEnabled
      }
      isWelcomeSaving = {
        isWelcomeSaving
      }
      onWelcomeEnabledChange = {
        (enabled) => {
          void onWelcomeEnabledChange(enabled);
        }
      }
      onRestartAll = {
        () => {
          void run(() => tour!.restartAll());
        }
      }
      onReplaySample = {
        () => {
          void run(() => tour!.startChapter('demo'));
        }
      }
      onStartChapter = {
        (id) => {
          const stayOnSettings = id === 'notifications' || id === 'theming';
          void run(async () => {
            await authApi.patchTutorial({ ResetChapter: id });
            await tour!.startChapter(id);
          }, !stayOnSettings);
        }
      }
    />
  );
};
