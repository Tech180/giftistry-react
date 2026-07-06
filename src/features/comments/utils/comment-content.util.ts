import { ListParticipant } from '../interfaces/list-participant.interface';

export type CommentContentSegment =
  | { type: 'text'; value: string }
  | { type: 'mention'; userId: string; username: string }
  | { type: 'item'; itemId: string; name: string };

const USER_MENTION_REGEX = /\[([^\]]+)\]\(user:([^)]+)\)/g;
const ITEM_TAG_REGEX = /\[([^\]]+)\]\(item:([^)]+)\)/g;
const COMBINED_REGEX = /\[([^\]]+)\]\((user|item):([^)]+)\)/g;

export function formatUserMention(participant: ListParticipant): string {
  return `[${participant.username}](user:${participant.userId})`;
}

export function getActiveMentionQuery(
  content: string,
  cursor: number
): { query: string; start: number; end: number } | null {
  const beforeCursor = content.slice(0, cursor);
  const match = beforeCursor.match(/(^|[\s(])@([a-zA-Z0-9_]*)$/);
  if (!match) return null;

  const query = match[2];
  const atIndex = beforeCursor.lastIndexOf(`@${query}`);
  if (atIndex === -1) return null;

  return { query, start: atIndex, end: cursor };
}

export function filterMentionCandidates(
  participants: ListParticipant[],
  query: string,
  currentUserId?: string
): ListParticipant[] {
  const normalized = query.toLowerCase();
  return participants
    .filter((participant) => participant.userId !== currentUserId)
    .filter((participant) => {
      if (!normalized) return true;
      return (
        participant.username.toLowerCase().startsWith(normalized) ||
        participant.displayName.toLowerCase().includes(normalized)
      );
    })
    .slice(0, 6);
}

export function insertUserMention(
  content: string,
  start: number,
  end: number,
  participant: ListParticipant
): { value: string; cursor: number } {
  const mention = `@${participant.username} `;
  const value = `${content.slice(0, start)}${mention}${content.slice(end)}`;
  return { value, cursor: start + mention.length };
}

export function convertMentionsToMarkdown(content: string, participants: ListParticipant[]): string {
  let finalContent = content;
  for (const participant of participants) {
    const regex = new RegExp(`(?<=^|[\\s(])@${participant.username}\\b`, 'g');
    finalContent = finalContent.replace(regex, `[${participant.username}](user:${participant.userId})`);
  }
  return finalContent;
}

export function getCaretPositionAndText(editorEl: HTMLDivElement): { text: string; cursorOffset: number } {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return { text: '', cursorOffset: 0 };
  
  try {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorEl);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    
    const textBeforeCaret = preCaretRange.toString();
    return { text: textBeforeCaret, cursorOffset: textBeforeCaret.length };
  } catch (err) {
    return { text: editorEl.innerText || '', cursorOffset: (editorEl.innerText || '').length };
  }
}

export function insertMentionNodeAtCaret(
  editorEl: HTMLDivElement,
  queryStartOffset: number,
  queryEndOffset: number,
  participant: ListParticipant,
  mentionClass: string,
  onMouseEnter?: (e: MouseEvent, userId: string, username: string) => void,
  onMouseLeave?: (e: MouseEvent) => void
) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const queryLength = queryEndOffset - queryStartOffset;
  
  try {
    range.setStart(range.endContainer, Math.max(0, range.endOffset - queryLength));
    range.deleteContents();
  } catch (err) {
    console.error('Error selecting query text node range:', err);
  }

  const span = document.createElement('span');
  span.className = mentionClass;
  span.contentEditable = 'false';
  span.innerText = `@${participant.username}`;
  span.setAttribute('data-user-id', participant.userId);
  span.setAttribute('data-username', participant.username);
  
  if (onMouseEnter) {
    span.addEventListener('mouseenter', (e) => onMouseEnter(e, participant.userId, participant.username));
  }
  if (onMouseLeave) {
    span.addEventListener('mouseleave', onMouseLeave);
  }
  
  range.insertNode(span);
  
  const space = document.createTextNode(' ');
  span.parentNode?.insertBefore(space, span.nextSibling);
  
  range.setStartAfter(space);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function getEditorContentAsMarkdown(editorEl: HTMLDivElement): string {
  let markdown = '';
  const traverse = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      markdown += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.getAttribute('data-user-id')) {
        const userId = el.getAttribute('data-user-id');
        const username = el.getAttribute('data-username') || el.innerText.replace(/^@/, '');
        markdown += `[${username}](user:${userId})`;
      } else if (el.tagName === 'BR') {
        markdown += '\n';
      } else if (el.tagName === 'DIV' || el.tagName === 'P') {
        if (markdown && !markdown.endsWith('\n')) {
          markdown += '\n';
        }
        for (const child of Array.from(el.childNodes)) {
          traverse(child);
        }
      } else {
        for (const child of Array.from(el.childNodes)) {
          traverse(child);
        }
      }
    }
  };
  for (const child of Array.from(editorEl.childNodes)) {
    traverse(child);
  }
  return markdown;
}

export function insertTextAtCaret(editorEl: HTMLDivElement, text: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    editorEl.innerText += text;
    return;
  }
  try {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch (err) {
    editorEl.innerText += text;
  }
}

export function parseCommentContent(content: string): {
  segments: CommentContentSegment[];
  itemIds: string[];
} {
  const segments: CommentContentSegment[] = [];
  const itemIds: string[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(COMBINED_REGEX)) {
    const matchIndex = match.index ?? 0;
    let precedingText = '';
    if (matchIndex > lastIndex) {
      precedingText = content.slice(lastIndex, matchIndex);
    }

    const label = match[1];
    const kind = match[2];
    const id = match[3];

    if (kind === 'user') {
      if (precedingText.endsWith('@')) {
        precedingText = precedingText.slice(0, -1);
      }
      if (precedingText) {
        segments.push({ type: 'text', value: precedingText });
      }
      segments.push({ type: 'mention', userId: id, username: label });
    } else {
      if (precedingText) {
        segments.push({ type: 'text', value: precedingText });
      }
      segments.push({ type: 'item', itemId: id, name: label });
      if (!itemIds.includes(id)) {
        itemIds.push(id);
      }
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return { segments, itemIds };
}

export function stripItemTagsFromSegments(segments: CommentContentSegment[]): CommentContentSegment[] {
  const result: CommentContentSegment[] = [];

  for (const segment of segments) {
    if (segment.type === 'item') continue;
    if (segment.type === 'mention') {
      result.push(segment);
      continue;
    }

    const cleaned = segment.value
      .replace(/\n*🏷️?\s*Tagged\s*Items:\s*/gi, '')
      .replace(ITEM_TAG_REGEX, '')
      .replace(USER_MENTION_REGEX, '');

    if (cleaned) {
      result.push({ type: 'text', value: cleaned });
    }
  }

  return result;
}
