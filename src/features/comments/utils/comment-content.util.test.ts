import { describe, expect, it } from 'vitest';
import {
  demoteUserMentionsInMarkdown,
  getMentionableParticipants,
} from './comment-content.util';
import { ListParticipant } from '../interfaces/list-participant.interface';

const participants: ListParticipant[] = [
  { userId: 'owner-1', username: 'owner', displayName: 'List Owner' },
  { userId: 'user-2', username: 'collab', displayName: 'Collaborator' },
];

describe('getMentionableParticipants', () => {
  it('excludes the list owner when a comment is invisible to owner', () => {
    const result = getMentionableParticipants(participants, {
      isOwner: false,
      isOwnerVisible: false,
      listOwnerId: 'owner-1',
    });

    expect(result).toEqual([participants[1]]);
  });

  it('keeps the list owner when the comment is visible to owner', () => {
    const result = getMentionableParticipants(participants, {
      isOwner: false,
      isOwnerVisible: true,
      listOwnerId: 'owner-1',
    });

    expect(result).toEqual(participants);
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
