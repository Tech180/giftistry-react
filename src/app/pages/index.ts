/**
 * Page components for direct imports (e.g. tests).
 * Route-level loading uses React.lazy in App.html.tsx — do not import this barrel
 * from the app shell or it will eager-load every page into the main chunk.
 */
export { default as Dashboard } from './dashboard/dashboard.component';
export { default as Login } from './login/login.component';
export { default as Register } from './register/register.component';
export { default as Settings } from './settings/settings.component';
export { default as WishlistDetail } from './wishlist-detail/wishlist-detail.component';
export { Setup } from './setup/setup.component';
export { default as FriendsPage } from './friends/friends-page.component';
export { default as InviteAcceptPage } from './invite-accept/invite-accept-page.component';
export { default as Onboarding } from './onboarding/onboarding.component';
export { default as ChangePassword } from './change-password/change-password.component';
export { default as UserProfile } from './user-profile/user-profile.component';
