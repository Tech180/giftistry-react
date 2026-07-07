export interface GiftistryUserPolicy {
  canCreateWishlists: boolean;
  maxActiveWishlists: number;
  canUseComments: boolean;
  canUseAiFeatures: boolean;
  canSharePublicLinks: boolean;
  canUploadImages: boolean;
  canSendFriendRequests: boolean;
  canUseCustomThemes: boolean;
}

export const DEFAULT_USER_POLICY: GiftistryUserPolicy = {
  canCreateWishlists: true,
  maxActiveWishlists: 0,
  canUseComments: true,
  canUseAiFeatures: true,
  canSharePublicLinks: true,
  canUploadImages: true,
  canSendFriendRequests: true,
  canUseCustomThemes: true,
};
