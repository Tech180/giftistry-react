import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { PromptCodeEditor } from './prompt-code-editor.component';

describe('PromptCodeEditor', () => {
  test('renders line numbers and highlights known tokens', () => {
    render(
      <PromptCodeEditor
        value={'Product: {itemName}\nURL: {url}'}
        onChange={vi.fn()}
        knownTokens={['{itemName}', '{url}']}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByLabelText('AI prompt editor')).toBeInTheDocument();
  });

  test('calls onChange when edited', () => {
    const onChange = vi.fn();

    render(
      <PromptCodeEditor
        value="Hello"
        onChange={onChange}
        knownTokens={[]}
      />
    );

    fireEvent.change(screen.getByLabelText('AI prompt editor'), {
      target: { value: 'Hello world' },
    });

    expect(onChange).toHaveBeenCalledWith('Hello world');
  });

  test('readOnly editor does not call onChange', () => {
    const onChange = vi.fn();

    render(
      <PromptCodeEditor
        value="Read only prompt"
        readOnly
        onChange={onChange}
        knownTokens={[]}
      />
    );

    fireEvent.change(screen.getByLabelText('AI prompt editor'), {
      target: { value: 'Changed' },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test('grayed linked sections render read-only styling', () => {
    const { container } = render(
      <PromptCodeEditor
        value={`=== Populate Prompt ===
Editable body

=== Description ===
Linked description

=== Category ===
Linked category`}
        onChange={vi.fn()}
        knownTokens={[]}
        readOnlyFromIndex={`=== Populate Prompt ===
Editable body`.length}
        showSectionDividers
      />
    );

    expect(container.querySelector('[class*="sectionDividerTitle"]')).toHaveTextContent(
      'Populate Prompt'
    );
    expect(container.querySelectorAll('[class*="sectionDividerTitle"]')).toHaveLength(3);
    expect(container.querySelector('[class*="codeLineReadOnly"]')).not.toBeNull();
  });
});
