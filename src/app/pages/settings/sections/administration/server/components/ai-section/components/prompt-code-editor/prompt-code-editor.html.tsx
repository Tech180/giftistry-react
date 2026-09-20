import React from 'react';
import type { PromptHighlightNode } from './interfaces/prompt-highlight-node.type';
import type { PromptHighlightSegment } from './interfaces/prompt-highlight-segment.type';
import type { SectionDividerProps } from './interfaces/section-divider-props.interface';
import type { PromptCodeEditorTemplateProps } from './interfaces/template-props.interface';
import styles from './prompt-code-editor.module.css';

function SectionDivider({ title, readOnly }: SectionDividerProps) {
  const dividerClass = styles['section-divider'];
  const lineClass = [
    styles['section-divider__line'],
    readOnly ? styles['section-divider__line--read-only'] : '',
  ].filter(Boolean).join(' ');
  const titleClass = [
    styles['section-divider__title'],
    readOnly ? styles['section-divider__title--read-only'] : styles['section-divider__title--active'],
  ].join(' ');

  return (
    <div className={dividerClass} aria-hidden="true">
      <span className={lineClass} />
      <span className={titleClass}>{title}</span>
      <span className={lineClass} />
    </div>
  );
}

function renderSegments(segments: PromptHighlightSegment[], keyPrefix: string) {
  return segments.map((segment, index) => {
    if (segment.kind !== 'token') {
      return <span key={`${keyPrefix}-${index}`}>{segment.value}</span>;
    }

    const tokenClass = segment.known
      ? (segment.muted ? styles['token-known--muted'] : styles['token-known'])
      : (segment.muted ? styles['token-unknown--muted'] : styles['token-unknown']);

    return (
      <span
        key={`${keyPrefix}-${index}`}
        className={tokenClass}
      >
        {segment.value}
      </span>
    );
  });
}

function renderHighlightNodes(nodes: PromptHighlightNode[]) {
  return nodes.map((node) => {
    if (node.kind === 'placeholder') {
      return <span key="placeholder" className={styles.placeholder}>{node.text}</span>;
    }

    if (node.kind === 'divider') {
      return (
        <SectionDivider
          key={node.key}
          title={node.title}
          readOnly={node.readOnly}
        />
      );
    }

    if (node.kind === 'line') {
      const lineClass = node.readOnly
        ? `${styles['code-line']} ${styles['code-line--read-only']}`
        : styles['code-line'];

      return (
        <span key={node.key} className={lineClass}>
          {renderSegments(node.segments, node.key)}
          {node.trailingNewline ? '\n' : null}
        </span>
      );
    }

    const content = renderSegments(node.segments, node.key);
    if (node.muted) {
      return (
        <span key={node.key} className={styles['section-read-only']}>
          {content}
        </span>
      );
    }

    return <React.Fragment key={node.key}>{content}</React.Fragment>;
  });
}

export const PromptCodeEditorTemplate: React.FC<PromptCodeEditorTemplateProps> = ({
  readOnly,
  lineNumbers,
  readOnlyLineStart,
  highlightNodes,
  value,
  ariaLabel,
  gutterRef,
  highlightRef,
  textareaRef,
  onChange,
  onScroll,
  onKeyDown,
  onSelect,
  onClick,
  onKeyUp,
  onBlur,
}) => {
  const shellClass = `${styles.shell}${readOnly ? ` ${styles['shell--read-only']}` : ''}`;
  const editorClass = `${styles.editor}${readOnly ? ` ${styles['editor--read-only']}` : ''}`;
  const gutterClass = `${styles.gutter}${readOnly ? ` ${styles['gutter--read-only']}` : ''}`;
  const textareaClass = `${styles.textarea}${readOnly ? ` ${styles['textarea--read-only']}` : ''}`;

  return (
    <div className={shellClass}>
      <div className={editorClass}>
        <div ref={gutterRef} className={gutterClass} aria-hidden="true">
          {lineNumbers.map((lineNumber, index) => (
            <div
              key={index}
              className={
                readOnlyLineStart != null && index + 1 >= readOnlyLineStart
                  ? `${styles['line-number']} ${styles['line-number--read-only']}`
                  : styles['line-number']
              }
            >
              {lineNumber}
            </div>
          ))}
        </div>

        <div className={styles['code-pane']}>
          <pre ref={highlightRef} className={styles.highlight} aria-hidden="true">
            <code className={styles['highlight__code']}>
              {renderHighlightNodes(highlightNodes)}
            </code>
          </pre>
          <textarea
            ref={textareaRef}
            className={textareaClass}
            value={value}
            onChange={onChange}
            onScroll={onScroll}
            onKeyDown={onKeyDown}
            onSelect={onSelect}
            onClick={onClick}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
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
};

export default PromptCodeEditorTemplate;
