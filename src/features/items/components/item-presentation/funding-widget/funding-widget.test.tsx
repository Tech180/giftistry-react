import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { FundingWidget } from './funding-widget.html';
import styles from './funding-widget.module.css';

describe('FundingWidget', () => {
  test('shows primary progress fill while funding is in progress', () => {
    const { container } = render(
      <FundingWidget totalExtractedPrice={100} totalClaimedAmount={40} />
    );

    expect(screen.getByText('$40.00 / $100.00')).toBeInTheDocument();
    expect(screen.queryByLabelText('Fully funded')).not.toBeInTheDocument();

    const fill = container.querySelector(`.${styles['progress-fill']}`);
    expect(fill?.className).not.toMatch(/progress-fill-complete/);
  });

  test('shows green progress fill and funded badge when target is met', () => {
    const { container } = render(
      <FundingWidget totalExtractedPrice={49.99} totalClaimedAmount={30 + 19.99} />
    );

    expect(screen.getByText('$49.99 / $49.99')).toBeInTheDocument();
    expect(screen.getByLabelText('Fully funded')).toHaveTextContent('Funded');

    const amountRow = screen.getByText('$49.99 / $49.99').parentElement;
    expect(amountRow?.firstElementChild).toHaveAttribute('aria-label', 'Fully funded');

    const fill = container.querySelector(`.${styles['progress-fill-complete']}`);
    expect(fill).toBeTruthy();
  });

  test('returns null when there is no funding target', () => {
    const { container } = render(
      <FundingWidget totalExtractedPrice={0} totalClaimedAmount={10} />
    );

    expect(container.firstChild).toBeNull();
  });
});
