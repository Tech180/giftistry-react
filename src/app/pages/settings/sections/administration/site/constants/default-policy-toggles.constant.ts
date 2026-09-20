import type { DefaultPolicyToggleDefinition } from '../interfaces/default-policy-toggle-definition.interface';

export const DEFAULT_POLICY_TOGGLES: DefaultPolicyToggleDefinition[] = [
  {
    key: 'CanCreateWishlists',
    title: 'Create wishlists',
    description: 'Allow new users to create wishlists.',
  },
  {
    key: 'CanUseComments',
    title: 'Use comments',
    description: 'Allow commenting on wishlists.',
  },
  {
    key: 'CanUseAiFeatures',
    title: 'Use AI features',
    description: 'Allow AI-powered features.',
  },
  {
    key: 'CanSharePublicLinks',
    title: 'Public sharing',
    description: 'Allow public link generation.',
  },
  {
    key: 'CanUploadImages',
    title: 'Upload images',
    description: 'Allow image uploads.',
  },
  {
    key: 'CanSendFriendRequests',
    title: 'Send friend requests',
    description: 'Allow friend requests.',
  },
  {
    key: 'CanUseCustomThemes',
    title: 'Use custom themes',
    description: 'Allow theme customization.',
  },
];
