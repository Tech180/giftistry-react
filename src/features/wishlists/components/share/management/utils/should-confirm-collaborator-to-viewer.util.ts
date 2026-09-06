export function shouldConfirmCollaboratorToViewer(
  currentRole: 'viewer' | 'collaborator',
  nextRole: 'viewer' | 'collaborator'
): boolean {
  return currentRole === 'collaborator' && nextRole === 'viewer';
}
