import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import type { PromptCodeEditorHandle } from './interfaces/handle.interface';
import type { PromptCodeEditorProps } from './interfaces/props.interface';
import { PromptCodeEditorTemplate } from './prompt-code-editor.html';
import { computeHighlightNodes } from './utils/compute-highlight-nodes.util';

export type { PromptCodeEditorHandle };

export const PromptCodeEditor = forwardRef<
  PromptCodeEditorHandle,
  PromptCodeEditorProps
>(function PromptCodeEditor(
  {
    value,
    onChange,
    placeholder,
    knownTokens = [],
    rows = 14,
    readOnly = false,
    readOnlyFromIndex = null,
    showSectionDividers = false,
    'aria-label': ariaLabel = 'AI prompt editor',
  },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const pendingCaretRef = useRef<number | null>(null);

  const lineCount = useMemo(() => {
    const lines = value.split('\n').length;
    return Math.max(rows, lines);
  }, [rows, value]);

  const readOnlyLineStart = useMemo(() => {
    if (readOnlyFromIndex == null || readOnlyFromIndex < 0) {
      return null;
    }

    return value.slice(0, readOnlyFromIndex).split('\n').length;
  }, [readOnlyFromIndex, value]);

  const lineNumbers = useMemo(() => {
    const width = String(lineCount).length;
    return Array.from({ length: lineCount }, (_, index) =>
      String(index + 1).padStart(width, '\u00a0')
    );
  }, [lineCount]);

  const highlightNodes = useMemo(
    () => computeHighlightNodes(value, knownTokens, placeholder, readOnlyFromIndex, showSectionDividers),
    [value, knownTokens, placeholder, readOnlyFromIndex, showSectionDividers]
  );

  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const gutter = gutterRef.current;
    if (!textarea || !highlight || !gutter) {
      return;
    }

    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
    gutter.scrollTop = textarea.scrollTop;
  }, []);

  const rememberSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
  }, []);

  const enforceEditableSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || readOnlyFromIndex == null || readOnlyFromIndex < 0) {
      return;
    }

    if (textarea.selectionStart > readOnlyFromIndex || textarea.selectionEnd > readOnlyFromIndex) {
      const start = Math.min(textarea.selectionStart, readOnlyFromIndex);
      const end = Math.min(textarea.selectionEnd, readOnlyFromIndex);
      textarea.setSelectionRange(start, end);
      selectionRef.current = { start, end };
    }
  }, [readOnlyFromIndex]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly || !onChange) {
      return;
    }

    onChange(event.target.value);
    requestAnimationFrame(() => {
      syncScroll();
      enforceEditableSelection();
      rememberSelection();
    });
  };

  useLayoutEffect(() => {
    syncScroll();
  }, [value, syncScroll]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || pendingCaretRef.current == null) {
      return;
    }

    const pos = pendingCaretRef.current;
    pendingCaretRef.current = null;
    textarea.focus();
    textarea.setSelectionRange(pos, pos);
    selectionRef.current = { start: pos, end: pos };
  }, [value]);

  useImperativeHandle(
    ref,
    () => ({
      insertAtCursor: (textToInsert: string) => {
        if (readOnly || !onChange) {
          return;
        }

        const textarea = textareaRef.current;
        let start = selectionRef.current.start;
        let end = selectionRef.current.end;

        if (textarea && document.activeElement === textarea) {
          start = textarea.selectionStart;
          end = textarea.selectionEnd;
        }

        if (readOnlyFromIndex != null && readOnlyFromIndex >= 0) {
          start = Math.min(start, readOnlyFromIndex);
          end = Math.min(end, readOnlyFromIndex);
        }

        const nextValue = `${value.slice(0, start)}${textToInsert}${value.slice(end)}`;
        pendingCaretRef.current = start + textToInsert.length;
        onChange(nextValue);
      },
    }),
    [onChange, readOnly, readOnlyFromIndex, value]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) {
      return;
    }

    if (readOnlyFromIndex != null && readOnlyFromIndex >= 0) {
      const textarea = event.currentTarget;
      const { selectionStart, selectionEnd } = textarea;

      if (event.key === 'ArrowDown' || event.key === 'End' || event.key === 'PageDown') {
        requestAnimationFrame(enforceEditableSelection);
      }

      if (
        selectionStart >= readOnlyFromIndex &&
        selectionEnd >= readOnlyFromIndex &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        textarea.setSelectionRange(readOnlyFromIndex, readOnlyFromIndex);
        return;
      }
    }

    if (event.key !== 'Tab') {
      return;
    }

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
    pendingCaretRef.current = start + 2;
    onChange?.(nextValue);
  };

  return (
    <PromptCodeEditorTemplate
      readOnly = {
        readOnly
      }
      lineNumbers = {
        lineNumbers
      }
      readOnlyLineStart = {
        readOnlyLineStart
      }
      highlightNodes = {
        highlightNodes
      }
      value = {
        value
      }
      ariaLabel = {
        ariaLabel
      }
      gutterRef = {
        gutterRef
      }
      highlightRef = {
        highlightRef
      }
      textareaRef = {
        textareaRef
      }
      onChange = {
        handleChange
      }
      onScroll = {
        syncScroll
      }
      onKeyDown = {
        handleKeyDown
      }
      onSelect = {
        () => {
          rememberSelection();
          enforceEditableSelection();
        }
      }
      onClick = {
        () => {
          rememberSelection();
          enforceEditableSelection();
        }
      }
      onKeyUp = {
        rememberSelection
      }
      onBlur = {
        rememberSelection
      }
    />
  );
});

export default PromptCodeEditor;
