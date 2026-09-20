import React from 'react';
import type { Props } from './interfaces/props.interface';
import { FieldsTemplate } from './fields.html';

export const Fields: React.FC<Props> = ({
  username,
  setUsername,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => (
  <FieldsTemplate
    username = {
      username
    }
    setUsername = {
      setUsername
    }
    email = {
      email
    }
    setEmail = {
      setEmail
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
    password = {
      password
    }
    setPassword = {
      setPassword
    }
    confirmPassword = {
      confirmPassword
    }
    setConfirmPassword = {
      setConfirmPassword
    }
  />
);
