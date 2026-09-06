import { describe, expect, test } from 'vitest';
import { shouldConfirmCollaboratorToViewer } from './should-confirm-collaborator-to-viewer.util';

describe('shouldConfirmCollaboratorToViewer', () => {
  test('returns true only for collaborator to viewer', () => {
    expect(shouldConfirmCollaboratorToViewer('collaborator', 'viewer')).toBe(true);
  });

  test('returns false for viewer to collaborator', () => {
    expect(shouldConfirmCollaboratorToViewer('viewer', 'collaborator')).toBe(false);
  });

  test('returns false when role is unchanged', () => {
    expect(shouldConfirmCollaboratorToViewer('collaborator', 'collaborator')).toBe(false);
    expect(shouldConfirmCollaboratorToViewer('viewer', 'viewer')).toBe(false);
  });
});
