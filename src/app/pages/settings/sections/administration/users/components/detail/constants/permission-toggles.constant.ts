import type { PermissionToggleDefinition } from '../interfaces/permission-toggle-definition.interface';

export const PERMISSION_TOGGLES: PermissionToggleDefinition[] = [
  {
    key: 'CanUseComments',
    title: 'Can use comments',
    description: 'Allow commenting on wishlists.',
  },
  {
    key: 'CanUseAiFeatures',
    title: 'Can use AI features',
    description: 'Allow AI-powered suggestions and parsing.',
  },
  {
    key: 'CanSharePublicLinks',
    title: 'Public sharing',
    description: 'Allow generating unauthenticated links.',
  },
  {
    key: 'CanUploadImages',
    title: 'Can upload images',
    description: 'Allow image uploads on lists and comments.',
  },
  {
    key: 'CanSendFriendRequests',
    title: 'Can send friend requests',
    description: 'Allow sending friend requests.',
  },
  {
    key: 'CanUseCustomThemes',
    title: 'Can use custom themes',
    description: 'Allow personal theme customization.',
  },
];
