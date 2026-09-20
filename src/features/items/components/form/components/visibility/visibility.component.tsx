import React from 'react';
import type { Props } from './interfaces/props.interface';
import { VisibilityTemplate } from './visibility.html';

export const Visibility: React.FC<Props> = (props) => {
  const { canCollaborate, substitutionEditor } = props;
  const isSubstitutionSurface = !!substitutionEditor;
  const isClaimerCustomStrip =
    !canCollaborate &&
    (substitutionEditor?.mode === 'create'
      ? substitutionEditor.kind === 'claimer_custom'
      : substitutionEditor?.option.Kind === 'claimer_custom');
  const showClaimOnCreate = substitutionEditor?.mode === 'create';

  return (
    <VisibilityTemplate
      {...props}
      isSubstitutionSurface = {
        isSubstitutionSurface
      }
      isClaimerCustomStrip = {
        isClaimerCustomStrip
      }
      showClaimOnCreate = {
        showClaimOnCreate
      }
    />
  );
};
