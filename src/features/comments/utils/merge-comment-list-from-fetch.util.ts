import type { Comment } from '../interfaces/comment.interface';

type ReactionEntry = NonNullable<Comment['Reactions']>[number];

function reactionKey(reaction: ReactionEntry): string {
  return `${String(reaction.UserId)}:${reaction.Reaction}`;
}

/** Union server and local reactions so a stale in-flight list fetch cannot drop a just-added reaction. */
export function mergeReactionLists(
  serverReactions: ReactionEntry[],
  localReactions: ReactionEntry[]
): ReactionEntry[] {
  const merged = new Map<string, ReactionEntry>();

  for (const reaction of serverReactions) {
    merged.set(reactionKey(reaction), reaction);
  }

  for (const reaction of localReactions) {
    if (!merged.has(reactionKey(reaction))) {
      merged.set(reactionKey(reaction), reaction);
    }
  }

  return [...merged.values()];
}

export function mergeCommentListFromFetch(fetched: Comment[], previous: Comment[]): Comment[] {
  if (previous.length === 0) {
    return fetched;
  }

  const previousById = new Map(previous.map((comment) => [comment.Id, comment]));

  return fetched.map((comment) => {
    const prior = previousById.get(comment.Id);
    const localReactions = prior?.Reactions;

    if (!localReactions?.length) {
      return comment;
    }

    const serverReactions = comment.Reactions ?? [];
    const mergedReactions = mergeReactionLists(serverReactions, localReactions);

    if (mergedReactions.length === serverReactions.length) {
      return comment;
    }

    return { ...comment, Reactions: mergedReactions };
  });
}
