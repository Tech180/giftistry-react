import React from 'react';
import { ProfileCard } from 'features/auth/components/profile-card/profile-card.component';
import { AccountTemplate } from './account.html';

export const Account: React.FC = () => (
  <AccountTemplate>
    <ProfileCard />
  </AccountTemplate>
);

export default Account;
