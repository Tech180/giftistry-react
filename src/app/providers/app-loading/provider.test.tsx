import React, { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { AppLoadingProvider } from './provider';
import { useAppLoading } from './context';

function Probe() {
  const { message, show, clear } = useAppLoading();

  useEffect(() => {
    show('Loading list...');
    return () => {
      clear();
    };
  }, [show, clear]);

  return (
    <div>
      <span data-testid="message">{message ?? ''}</span>
      <button
        type="button"
        onClick={() => {
          clear();
        }}
      >
        Clear
      </button>
    </div>
  );
}

function NestedProbe() {
  const { message, show, clear } = useAppLoading();

  return (
    <div>
      <span data-testid="message">{message ?? ''}</span>
      <button
        type="button"
        onClick={() => {
          show('Loading...');
        }}
      >
        Show chunk
      </button>
      <button
        type="button"
        onClick={() => {
          show('Loading list...');
        }}
      >
        Show page
      </button>
      <button
        type="button"
        onClick={() => {
          clear();
        }}
      >
        Clear one
      </button>
    </div>
  );
}

describe('AppLoadingProvider', () => {
  test('show sets message and clear removes it', () => {
    render(
      <AppLoadingProvider>
        <Probe />
      </AppLoadingProvider>
    );

    expect(screen.getByTestId('message')).toHaveTextContent('Loading list...');

    fireEvent.click(screen.getByRole('button', { name: /^clear$/i }));
    expect(screen.getByTestId('message')).toHaveTextContent('');
  });

  test('nested show keeps overlay until matching clears', () => {
    render(
      <AppLoadingProvider>
        <NestedProbe />
      </AppLoadingProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /show chunk/i }));
    expect(screen.getByTestId('message')).toHaveTextContent('Loading...');

    fireEvent.click(screen.getByRole('button', { name: /show page/i }));
    expect(screen.getByTestId('message')).toHaveTextContent('Loading list...');

    fireEvent.click(screen.getByRole('button', { name: /clear one/i }));
    expect(screen.getByTestId('message')).toHaveTextContent('Loading...');

    fireEvent.click(screen.getByRole('button', { name: /clear one/i }));
    expect(screen.getByTestId('message')).toHaveTextContent('');
  });
});
