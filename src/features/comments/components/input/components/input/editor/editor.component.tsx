import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { EditorProps } from './interfaces/editor-props.interface';
import { CommentEditorHandle } from './interfaces/editor-handle.interface';
import { EditorTemplate } from './editor.html';
import { MentionPreview } from '../../mention';
import {
  filterMentionCandidates,
  getActiveMentionQuery,
  getCaretPositionAndText,
  insertMentionNodeAtCaret,
  insertTextAtCaret,
  getEditorContentAsMarkdown,
} from '../../../../../utils/comment-content.util';
import styles from './editor.module.css';

export const CommentEditor = forwardRef<CommentEditorHandle, EditorProps>(
  ({ content, setContent, participants, currentUserId, onSubmit }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [mentionQuery, setMentionQuery] = useState<string | null>(null);
    const [mentionRange, setMentionRange] = useState<{ start: number; end: number } | null>(null);
    const [activeMentionIndex, setActiveMentionIndex] = useState(0);
    const [hoveredUser, setHoveredUser] = useState<{ userId: string; displayName: string; rect: DOMRect } | null>(null);

    const mentionCandidates = useMemo(() => {
      if (mentionQuery === null) return [];
      return filterMentionCandidates(participants, mentionQuery, currentUserId);
    }, [participants, mentionQuery, currentUserId]);

    const syncMentionState = useCallback((value: string, cursor: number) => {
      const active = getActiveMentionQuery(value, cursor);
      if (!active) {
        setMentionQuery(null);
        setMentionRange(null);
        setActiveMentionIndex(0);
        return;
      }
      setMentionQuery(active.query);
      setMentionRange({ start: active.start, end: active.end });
      setActiveMentionIndex(0);
    }, []);

    const handleMentionMouseEnter = useCallback((e: MouseEvent, userId: string, username: string) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setHoveredUser({ userId, displayName: username, rect });
    }, []);

    const handleMentionMouseLeave = useCallback(() => {
      setHoveredUser(null);
    }, []);

    const applyMention = useCallback(
      (index: number) => {
        const participant = mentionCandidates[index];
        const editor = editorRef.current;
        if (!participant || !mentionRange || !editor) return;

        insertMentionNodeAtCaret(
          editor,
          mentionRange.start,
          mentionRange.end,
          participant,
          styles['mention-pill'],
          handleMentionMouseEnter,
          handleMentionMouseLeave
        );

        const markdown = getEditorContentAsMarkdown(editor);
        setContent(markdown);
        setMentionQuery(null);
        setMentionRange(null);
        setActiveMentionIndex(0);

        requestAnimationFrame(() => editor.focus());
      },
      [mentionCandidates, mentionRange, setContent, handleMentionMouseEnter, handleMentionMouseLeave]
    );

    const handleEditorInput = (event: React.FormEvent<HTMLDivElement>) => {
      const editor = editorRef.current;
      if (!editor) return;

      setContent(getEditorContentAsMarkdown(editor));
      const { text, cursorOffset } = getCaretPositionAndText(editor);
      syncMentionState(text, cursorOffset);
    };

    const handleEditorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (mentionCandidates.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setActiveMentionIndex((prev) => (prev + 1) % mentionCandidates.length);
          return;
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setActiveMentionIndex((prev) => (prev - 1 + mentionCandidates.length) % mentionCandidates.length);
          return;
        }
        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          applyMention(activeMentionIndex);
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          setMentionQuery(null);
          setMentionRange(null);
          return;
        }
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSubmit(event);
      }
    };

    useImperativeHandle(ref, () => ({
      insertText: (text: string) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        insertTextAtCaret(editor, text);
        setContent(getEditorContentAsMarkdown(editor));
      },
      focus: () => editorRef.current?.focus(),
    }));

    useEffect(() => {
      if (mentionCandidates.length === 0) {
        setActiveMentionIndex(0);
        return;
      }
      if (activeMentionIndex >= mentionCandidates.length) {
        setActiveMentionIndex(0);
      }
    }, [activeMentionIndex, mentionCandidates.length]);

    useEffect(() => {
      if (content === '' && editorRef.current && editorRef.current.innerHTML !== '') {
        editorRef.current.innerHTML = '';
      }
    }, [content]);

    return (
      <>
        <EditorTemplate
          editorRef={editorRef}
          onEditorInput={handleEditorInput}
          onEditorKeyDown={handleEditorKeyDown}
          showMentionSuggestions={mentionQuery !== null && mentionCandidates.length > 0}
          mentionCandidates={mentionCandidates}
          activeMentionIndex={activeMentionIndex}
          onMentionHover={setActiveMentionIndex}
          onMentionSelect={applyMention}
        />
        <MentionPreview hoveredUser={hoveredUser} onClear={() => setHoveredUser(null)} />
      </>
    );
  }
);

CommentEditor.displayName = 'CommentEditor';
