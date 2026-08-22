import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badges } from './badges.html';

const baseItem = {
  Id: 'item-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Test',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
};

describe('Badges', () => {
  it('shows priority badge when item has priority', () => {
    render(
      <Badges
        item={{ ...baseItem, Priority: 1 }}
        audienceLabel={null}
        isPrivate={false}
      />
    );

    expect(screen.getByText('Priority:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('hides priority badge when showPriority is false', () => {
    render(
      <Badges
        item={{ ...baseItem, Priority: 1 }}
        audienceLabel={null}
        isPrivate={false}
        showPriority={false}
      />
    );

    expect(screen.queryByText('Priority:')).not.toBeInTheDocument();
  });

  it('shows Everyone audience with globe affordance', () => {
    const { container } = render(
      <Badges
        item={baseItem}
        audienceLabel="Everyone"
        isPrivate={false}
        showPriority={false}
      />
    );

    expect(screen.getByText('Everyone')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
