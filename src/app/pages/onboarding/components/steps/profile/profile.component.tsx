import React from 'react';
import type { ProfileProps } from './interfaces/profile-props.interface';
import { ProfileTemplate } from './profile.html';

export const Profile: React.FC<ProfileProps> = (props) => <ProfileTemplate {...props} />;
