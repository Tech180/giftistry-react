import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, useAuth, type TourChapterStatus } from 'features/auth';
import { TOUR_CHAPTERS, useTourOptional } from 'features/tour';
import type { ChapterRow } from './interfaces/chapter-row.interface';
import { TutorialTemplate } from './tutorial.html';

export const Tutorial: React.FC = () => {
  const { user, canShowAi, refreshUser } = useAuth();
  const tour = useTourOptional();
  const navigate = useNavigate();
  const [isBusy, setIsBusy] = useState(false);

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

  return (
    <TutorialTemplate
      chapters = {
        chapters
      }
      isBusy = {
        isBusy
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
