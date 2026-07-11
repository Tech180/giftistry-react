export interface GiftistryUserPolicy {
  CanCreateWishlists: boolean;
  MaxActiveWishlists: number;
  CanUseComments: boolean;
  CanUseAiFeatures: boolean;
  CanSharePublicLinks: boolean;
  CanUploadImages: boolean;
  CanSendFriendRequests: boolean;
  CanUseCustomThemes: boolean;
}

export const DEFAULT_USER_POLICY: GiftistryUserPolicy = {
  CanCreateWishlists: true,
  MaxActiveWishlists: 0,
  CanUseComments: true,
  CanUseAiFeatures: true,
  CanSharePublicLinks: true,
  CanUploadImages: true,
  CanSendFriendRequests: true,
  CanUseCustomThemes: true,
};
