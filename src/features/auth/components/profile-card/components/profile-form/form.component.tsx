import React from 'react';
import type { Props } from './interfaces/props.interface';
import { FormTemplate } from './form.html';

export const Form: React.FC<Props> = ({
  username,
  setUsername,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  email,
  isLoading,
  hasChanges,
  handleSubmit,
}) => (
  <FormTemplate
    username = {
      username
    }
    setUsername = {
      setUsername
    }
    firstName = {
      firstName
    }
    setFirstName = {
      setFirstName
    }
    lastName = {
      lastName
    }
    setLastName = {
      setLastName
    }
    bio = {
      bio
    }
    setBio = {
      setBio
    }
    email = {
      email
    }
    isLoading = {
      isLoading
    }
    hasChanges = {
      hasChanges
    }
    handleSubmit = {
      handleSubmit
    }
  />
);
