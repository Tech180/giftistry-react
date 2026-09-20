export type CommentContentSegment =
  | { type: 'text'; value: string }
  | { type: 'mention'; userId: string; username: string }
  | { type: 'item'; itemId: string; name: string };
