import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

const onToggle = vi.fn();

vi.mock('features/experimental-features', async () => {
  const actual = await vi.importActual<typeof import('features/experimental-features')>(
    'features/experimental-features'
  );
  return {
    ...actual,
    useExperimentalFeatures: () => ({
      definitions: actual.EXPERIMENTAL_FEATURES,
      features: {},
      isEnabled: () => false,
      isSaving: false,
      onToggle,
    }),
  };
});

vi.mock('../account/components/tutorial/tutorial.component', () => ({
  Tutorial: () => <div data-testid="tutorial-panel">Tutorial</div>,
}));

import { Experimental } from './experimental.component';

describe('Experimental settings', () => {
  test('renders registry toggles and forwards toggle to hook', () => {
    render(
      <Experimental
        showToast = {
          vi.fn()
        }
      />
    );

    expect(screen.getByText('Experimental')).toBeInTheDocument();
    expect(screen.getByText('Product tutorial')).toBeInTheDocument();
    expect(screen.queryByTestId('tutorial-panel')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/product tutorial/i));
    expect(onToggle).toHaveBeenCalledWith('productTutorial', true);
  });
});
