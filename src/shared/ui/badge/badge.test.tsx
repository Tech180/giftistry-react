import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { Search } from 'lucide-react';
import { Badge } from './badge.component';

describe('Badge', () => {
  test('renders as a span when there is no action', () => {
    render(<Badge size="sm">Pending</Badge>);

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('renders as a button when onClick is provided', () => {
    const onClick = vi.fn();
    render(
      <Badge onClick={onClick} ariaLabel="Toggle web search" ariaPressed={true} active>
        Enabled
      </Badge>
    );

    const button = screen.getByRole('button', { name: 'Toggle web search' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  test('renders optional icon', () => {
    render(
      <Badge icon={<Search data-testid="badge-icon" size={16} />}>Web Search</Badge>
    );

    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    expect(screen.getByText('Web Search')).toBeInTheDocument();
  });

  test('applies active class when active', () => {
    render(
      <Badge active ariaLabel="active badge">
        Enabled
      </Badge>
    );

    const el = screen.getByLabelText('active badge');
    expect(el.className).toMatch(/active/);
  });

  test('applies rainbow effect class', () => {
    render(
      <Badge effect="rainbow" active ariaLabel="ai badge">
        AI Enabled
      </Badge>
    );

    const el = screen.getByLabelText('ai badge');
    expect(el.className).toMatch(/effect-rainbow|effectRainbow/);
  });

  test('hides label content for compact size when children omitted', () => {
    render(
      <Badge size="compact" icon={<Search data-testid="compact-icon" size={16} />} ariaLabel="compact" />
    );

    expect(screen.getByTestId('compact-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('compact')).toBeInTheDocument();
  });

  test('keeps currentColor icons visible when rainbow is active', () => {
    render(
      <Badge
        effect="rainbow"
        active
        size="compact"
        icon={<Search data-testid="rainbow-icon" size={16} />}
        ariaLabel="Import wishlist"
        onClick={() => {}}
      />
    );

    const iconFace = screen.getByTestId('rainbow-icon').closest('[class*="icon-face"]');
    expect(iconFace?.className).toMatch(/icon-face|iconFace/);
    expect(screen.getByRole('button', { name: /import wishlist/i })).toBeInTheDocument();
  });
});
