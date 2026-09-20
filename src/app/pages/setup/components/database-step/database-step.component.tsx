import React from 'react';
import { DatabaseStepTemplate } from './database-step.html';
import type { DatabaseStepProps } from './interfaces/props.interface';

export const DatabaseStep: React.FC<DatabaseStepProps> = ({
  dbType,
  dbUrl,
  errors,
  onFieldChange,
}) => (
  <DatabaseStepTemplate
    dbType = {
      dbType
    }
    dbUrl = {
      dbUrl
    }
    errors = {
      errors
    }
    onFieldChange = {
      onFieldChange
    }
  />
);
