import React from 'react';
import { useExperimentalFeatures } from 'features/experimental-features';
import type { Props } from './interfaces/props.interface';
import { ExperimentalTemplate } from './experimental.html';

export const Experimental: React.FC<Props> = ({ showToast }) => {
  const {
    definitions,
    isEnabled,
    isSaving,
    onToggle,
  } = useExperimentalFeatures({ showToast });

  return (
    <ExperimentalTemplate
      definitions = {
        definitions
      }
      isEnabled = {
        isEnabled
      }
      isSaving = {
        isSaving
      }
      productTutorialEnabled = {
        isEnabled('productTutorial')
      }
      onToggle = {
        (id, enabled) => {
          void onToggle(id, enabled);
        }
      }
    />
  );
};

export default Experimental;
