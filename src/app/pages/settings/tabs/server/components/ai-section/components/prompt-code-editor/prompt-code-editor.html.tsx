import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { splitPromptText } from '../../utils/highlight-prompt-text.util';
import { PromptCodeEditorProps } from './interfaces/prompt-code-editor-props.interface';
import styles from './prompt-code-editor.module.css';

function HighlightedPromptText({
  text,
  knownTokens,
  placeholder,
}: {
  text: string;
  knownTokens: string[];
  placeholder?: string;
}) {
  if (!text.trim() && placeholder) {
    return <span className={styles.placeholder}>{placeholder}</span>;
  }

  const segments = splitPromptText(text);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type !== 'token') {
          return <span key={index}>{segment.value}</span>;
        }

        const isKnown = knownTokens.includes(segment.value);
        return (
          <span
            key={index}
            className={isKnown ? styles.tokenKnown : styles.tokenUnknown}
          >
            {segment.value}
          </span>
        );
      })}
    </>
  );
}

export const PromptCodeEditorTemplate: React.FC<PromptCodeEditorProps> = ({
  value,
  onChange,
  placeholder,
  knownTokens = [],
  rows = 14,
  'aria-label': ariaLabel = 'AI prompt editor',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => {
    const lines = value.split('\n').length;
    return Math.max(rows, lines);
  }, [rows, value]);

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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    requestAnimationFrame(syncScroll);
  };

  useLayoutEffect(() => {
    syncScroll();
  }, [value, syncScroll]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.selectionStart = start + 2;
      textarea.selectionEnd = start + 2;
    });
  };

  return (
    <div className={styles.shell}>
      <div className={styles.editor}>
        <div ref={gutterRef} className={styles.gutter} aria-hidden="true">
          {lineNumbers.map((lineNumber, index) => (
            <div key={index} className={styles.lineNumber}>
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
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            aria-label={ariaLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default PromptCodeEditorTemplate;
