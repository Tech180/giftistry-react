import React, { useState, useEffect } from 'react';
import { useAuth } from 'app/providers/AuthContext';
import { ProfileCardTemplate } from './profile-card.html';

export const ProfileCard: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.Username);
      setFirstName(user.FirstName);
      setLastName(user.LastName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !firstName || !lastName) {
      setErrorMsg('All fields are required.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await updateProfile(username, firstName, lastName);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <ProfileCardTemplate
      user={user}
      username={username}
      setUsername={setUsername}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      isLoading={isLoading}
      errorMsg={errorMsg}
      successMsg={successMsg}
      handleSubmit={handleSubmit}
    />
  );
};
