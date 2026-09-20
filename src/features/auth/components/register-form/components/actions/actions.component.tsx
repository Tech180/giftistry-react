import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ActionsTemplate } from './actions.html';

export const Actions: React.FC<Props> = ({
  isLoading,
  disabled,
  oauthEnabled,
  oauthButtonText,
  onOauthSignup,
}) => (
  <ActionsTemplate
    isLoading = {
      isLoading
    }
    disabled = {
      disabled
    }
    oauthEnabled = {
      oauthEnabled
    }
    oauthButtonText = {
      oauthButtonText
    }
    onOauthSignup = {
      onOauthSignup
    }
  />
);
