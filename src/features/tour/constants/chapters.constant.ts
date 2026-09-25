import type { TourChapterId } from 'features/auth';

export interface TourChapterDef {
  id: TourChapterId;
  title: string;
  description: string;
  /** When false, chapter is omitted from Continue flow. */
  when?: (ctx: TourEligibilityContext) => boolean;
}

export interface TourEligibilityContext {
  canShowAi: boolean;
  canAutoAdd: boolean;
}

export const TOUR_CHAPTERS: TourChapterDef[] = [
  {
    id: 'demo',
    title: 'Sample list',
    description: 'See how a wishlist looks when friends are using it.',
  },
  {
    id: 'beginner',
    title: 'Create your list',
    description: 'Make your first wishlist and add an item.',
  },
  {
    id: 'importAi',
    title: 'Import & auto-add',
    description: 'Import lists and add items from product links.',
    when: (ctx) => ctx.canShowAi,
  },
  {
    id: 'listTools',
    title: 'List tools',
    description: 'View modes, settings, and discussion.',
  },
  {
    id: 'shareDeep',
    title: 'Sharing',
    description: 'Invite links, roles, and access.',
  },
  {
    id: 'friendsDeep',
    title: 'Friends',
    description: 'Find people and manage requests.',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Stay updated on claims and comments.',
  },
  {
    id: 'theming',
    title: 'Theming',
    description: 'Appearance and workspace style.',
  },
];

export function eligibleChapters(ctx: TourEligibilityContext): TourChapterDef[] {
  return TOUR_CHAPTERS.filter((chapter) => (chapter.when ? chapter.when(ctx) : true));
}
