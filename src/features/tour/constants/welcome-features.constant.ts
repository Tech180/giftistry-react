import type { WelcomeFeatureCopy } from '../interfaces/welcome-feature-copy.interface';

/** Product-neutral welcome rows derived from chapter descriptions (not demo marketing). */
export const TOUR_WELCOME_FEATURES: WelcomeFeatureCopy[] = [
  {
    icon: 'gift',
    title: 'Sample list',
    description: 'See how a wishlist looks when friends are using it.',
  },
  {
    icon: 'list-plus',
    title: 'Create your list',
    description: 'Make your first wishlist and add an item.',
  },
  {
    icon: 'users',
    title: 'Share & friends',
    description: 'Invite people and manage who can see your lists.',
  },
];
