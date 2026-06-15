import React from 'react';
import { ProfileCard } from 'features/auth';

export default function Profile() {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)', alignItems: 'center', justifyContent: 'center' }}>
      <ProfileCard />
    </div>
  );
}
