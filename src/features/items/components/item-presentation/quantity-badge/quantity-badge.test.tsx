import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuantityBadge } from './quantity-badge.html';

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

describe('QuantityBadge', () => {
  it('renders nothing when quantity is 1', () => {
    const { container } = render(<QuantityBadge item={baseItem} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders ×N left-ready label when desired quantity is greater than 1', () => {
    render(<QuantityBadge item={{ ...baseItem, DesiredQuantity: 3 }} />);
    expect(screen.getByLabelText('Quantity ×3')).toBeInTheDocument();
  });

  it('renders claimed/desired when claims exist', () => {
    render(
      <QuantityBadge
        item={{
          ...baseItem,
          DesiredQuantity: 4,
          TotalClaimedQuantity: 1,
          IsMultiCount: true,
        }}
      />
    );
    expect(screen.getByText('1/4')).toBeInTheDocument();
  });
});
