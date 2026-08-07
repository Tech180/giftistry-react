import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import { parsePopulateHubHeaderLine } from '../../../../utils/populate-hub-prompt.util';
import { splitPromptText } from '../../utils/highlight-prompt-text.util';
import { PromptCodeEditorHandle } from './interfaces/prompt-code-editor-handle.interface';
import { PromptCodeEditorProps } from './interfaces/prompt-code-editor-props.interface';
import styles from './prompt-code-editor.module.css';

function renderPromptSegments(text: string, knownTokens: string[], keyPrefix: string) {
  const segments = splitPromptText(text);

  return segments.map((segment, index) => {
    if (segment.type !== 'token') {
      return <span key={`${keyPrefix}-${index}`}>{segment.value}</span>;
    }

    const isKnown = knownTokens.includes(segment.value);
    return (
      <span
        key={`${keyPrefix}-${index}`}
        className={isKnown ? styles.tokenKnown : styles.tokenUnknown}
      >
        {segment.value}
      </span>
    );
  });
}

function SectionDivider({
  title,
  readOnly,
}: {
  title: string;
  readOnly: boolean;
}) {
  const dividerClass = readOnly
    ? `${styles.sectionDivider} ${styles.sectionDividerReadOnly}`
    : `${styles.sectionDivider} ${styles.sectionDividerActive}`;

  return (
    <div className={dividerClass} aria-hidden="true">
      <span className={styles.sectionDividerLine} />
      <span className={styles.sectionDividerTitle}>{title}</span>
      <span className={styles.sectionDividerLine} />
    </div>
  );
}

function HighlightedPromptWithDividers({
  text,
  knownTokens,
  readOnlyFromIndex,
}: {
  text: string;
  knownTokens: string[];
  readOnlyFromIndex?: number | null;
}) {
  const lines = text.split('\n');
  let charOffset = 0;

  return (
    <>
      {lines.map((line, lineIndex) => {
        const lineStart = charOffset;
        charOffset += line.length + (lineIndex < lines.length - 1 ? 1 : 0);

        const headerTitle = parsePopulateHubHeaderLine(line);
        const isReadOnly =
          readOnlyFromIndex != null &&
          readOnlyFromIndex >= 0 &&
          lineStart >= readOnlyFromIndex;

        if (headerTitle) {
          return (
            <SectionDivider
              key={`divider-${lineIndex}`}
              title={headerTitle}
              readOnly={isReadOnly}
            />
          );
        }

        const lineClass = isReadOnly
          ? `${styles.codeLine} ${styles.codeLineReadOnly}`
          : styles.codeLine;

        return (
          <span key={`line-${lineIndex}`} className={lineClass}>
            {renderPromptSegments(line, knownTokens, `line-${lineIndex}`)}
            {lineIndex < lines.length - 1 ? '\n' : null}
          </span>
        );
      })}
    </>
  );
}

function HighlightedPromptText({
  text,
  knownTokens,
  placeholder,
  readOnlyFromIndex,
  showSectionDividers = false,
}: {
  text: string;
  knownTokens: string[];
  placeholder?: string;
  readOnlyFromIndex?: number | null;
  showSectionDividers?: boolean;
}) {
  if (!text.trim() && placeholder) {
    return <span className={styles.placeholder}>{placeholder}</span>;
  }

  if (showSectionDividers) {
    return (
      <HighlightedPromptWithDividers
        text={text}
        knownTokens={knownTokens}
        readOnlyFromIndex={readOnlyFromIndex}
      />
    );
  }

  const hasLockedTail =
    readOnlyFromIndex != null && readOnlyFromIndex >= 0 && readOnlyFromIndex < text.length;

  if (!hasLockedTail) {
    return <>{renderPromptSegments(text, knownTokens, 'segment')}</>;
  }

  const editableText = text.slice(0, readOnlyFromIndex);
  const readOnlyText = text.slice(readOnlyFromIndex);

  return (
    <>
      {renderPromptSegments(editableText, knownTokens, 'editable')}
      <span className={styles.sectionReadOnly}>
        {renderPromptSegments(readOnlyText, knownTokens, 'readonly')}
      </span>
    </>
  );
}

export const PromptCodeEditorTemplate = forwardRef<
  PromptCodeEditorHandle,
  PromptCodeEditorProps
>(function PromptCodeEditorTemplate(
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
    if (readOnlyFromIndex == null || readOnlyFromIndex < 0) return null;
    return value.slice(0, readOnlyFromIndex).split('\n').length;
  }, [readOnlyFromIndex, value]);

  const lineNumbers = useMemo(() => {
    const width = String(lineCount).length;
    return Array.from({ length: lineCount }, (_, index) =>
      String(index + 1).padStart(width, '\u00a0')
    );
  }, [lineCount]);

  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;
    const gutter = gutterRef.current;
    if (!textarea || !highlight || !gutter) return;

    highlight.scrollTop = textarea.scrollTop;
    highlight.scrollLeft = textarea.scrollLeft;
    gutter.scrollTop = textarea.scrollTop;
  }, []);

  const rememberSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    selectionRef.current = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    };
  }, []);

  const enforceEditableSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || readOnlyFromIndex == null || readOnlyFromIndex < 0) return;

    if (textarea.selectionStart > readOnlyFromIndex || textarea.selectionEnd > readOnlyFromIndex) {
      const start = Math.min(textarea.selectionStart, readOnlyFromIndex);
      const end = Math.min(textarea.selectionEnd, readOnlyFromIndex);
      textarea.setSelectionRange(start, end);
      selectionRef.current = { start, end };
    }
  }, [readOnlyFromIndex]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly || !onChange) return;
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
    if (!textarea || pendingCaretRef.current == null) return;

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
        if (readOnly || !onChange) return;

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
    if (readOnly) return;

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

    if (event.key !== 'Tab') return;

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
    pendingCaretRef.current = start + 2;
    onChange?.(nextValue);
  };

  return (
    <div className={`${styles.shell} ${readOnly ? styles.readOnly : ''}`}>
      <div className={styles.editor}>
        <div ref={gutterRef} className={styles.gutter} aria-hidden="true">
          {lineNumbers.map((lineNumber, index) => (
            <div
              key={index}
              className={
                readOnlyLineStart != null && index + 1 >= readOnlyLineStart
                  ? `${styles.lineNumber} ${styles.lineNumberReadOnly}`
                  : styles.lineNumber
              }
            >
              {lineNumber}
            </div>
          ))}
        </div>

        <div className={styles.codePane}>
          <pre ref={highlightRef} className={styles.highlight} aria-hidden="true">
            <code>
              <HighlightedPromptText
                text={value}
                knownTokens={knownTokens}
                placeholder={placeholder}
                readOnlyFromIndex={readOnlyFromIndex}
                showSectionDividers={showSectionDividers}
              />
            </code>
          </pre>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={value}
            onChange={handleChange}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            onSelect={() => {
              rememberSelection();
              enforceEditableSelection();
            }}
            onClick={() => {
              rememberSelection();
              enforceEditableSelection();
            }}
            onKeyUp={rememberSelection}
            onBlur={rememberSelection}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            readOnly={readOnly}
            aria-readonly={readOnly || undefined}
            aria-label={ariaLabel}
            tabIndex={readOnly ? -1 : undefined}
          />
        </div>
      </div>
    </div>
  );
});

export default PromptCodeEditorTemplate;
