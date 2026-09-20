import React from 'react';
import type { TimeoutsProps } from './interfaces/props.interface';
import { TimeoutsTemplate } from './timeouts.html';

export const Timeouts: React.FC<TimeoutsProps> = ({
  aiEnabled,
  aiConnectTimeoutMs,
  setAiConnectTimeoutMs,
  aiCompletionTimeoutMs,
  setAiCompletionTimeoutMs,
}) => (
  <TimeoutsTemplate
    aiEnabled = {
      aiEnabled
    }
    aiConnectTimeoutMs = {
      aiConnectTimeoutMs
    }
    setAiConnectTimeoutMs = {
      setAiConnectTimeoutMs
    }
    aiCompletionTimeoutMs = {
      aiCompletionTimeoutMs
    }
    setAiCompletionTimeoutMs = {
      setAiCompletionTimeoutMs
    }
  />
);

export default Timeouts;
