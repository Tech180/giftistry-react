import { describe, expect, it } from 'vitest';
import {
  demoteUserMentionsInMarkdown,
  getMentionableParticipants,
} from './comment-content.util';
import { ListParticipant } from '../interfaces/list-participant.interface';

const participants: ListParticipant[] = [
  { userId: 'owner-1', username: 'owner', displayName: 'List Owner', role: 'owner' },
  { userId: 'user-2', username: 'collab', displayName: 'Collaborator', role: 'collaborator' },
  { userId: 'user-3', username: 'viewer', displayName: 'Viewer', role: 'viewer' },
];

describe('getMentionableParticipants', () => {
  it('excludes the list owner when a comment is invisible to owner', () => {
    const result = getMentionableParticipants(participants, {
      isOwner: false,
      mode: 'hiddenFromOwner',
      listOwnerId: 'owner-1',
    });

    expect(result).toEqual([participants[1], participants[2]]);
  });

  it('keeps the list owner when the comment is visible to owner', () => {
    const result = getMentionableParticipants(participants, {
      isOwner: false,
      mode: 'visibleToAll',
      listOwnerId: 'owner-1',
    });

    expect(result).toEqual(participants);
  });

  it('limits mentions to selected audience', () => {
    const result = getMentionableParticipants(participants, {
      isOwner: false,
      mode: 'visibleToSelected',
      selectedUserIds: ['owner-1', 'user-3'],
      listOwnerId: 'owner-1',
    });

    expect(result).toEqual([participants[0], participants[2]]);
  });
});

describe('demoteUserMentionsInMarkdown', () => {
  it('converts owner mention markdown to plain @ text', () => {
    const result = demoteUserMentionsInMarkdown(
      'Hey [owner](user:owner-1) check this out',
      ['owner-1']
    );

    expect(result).toBe('Hey @owner check this out');
  });

  it('leaves other user mentions unchanged', () => {
    const result = demoteUserMentionsInMarkdown(
      'Hey [collab](user:user-2) and [owner](user:owner-1)',
      ['owner-1']
    );

    expect(result).toBe('Hey [collab](user:user-2) and @owner');
  });
});
