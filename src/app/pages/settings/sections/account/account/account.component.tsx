import React from 'react';
import { ProfileCard } from 'features/auth/components/profile-card/profile-card.component';
import { AccountTemplate } from './account.html';
import { Tutorial } from './components/tutorial/tutorial.component';

export const Account: React.FC = () => (
  <AccountTemplate>
    <ProfileCard />
    <Tutorial />
  </AccountTemplate>
);

export default Account;
