import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import styles from '../tab-item/tab-item.module.css';
import { TabBar } from './tab-bar.component';

const tabs = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'active', label: 'Active', count: 3 },
];

describe('TabBar', () => {
  test('renders all tab labels and counts', () => {
    render(<TabBar tabs={tabs} activeTab="all" onTabChange={() => {}} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('calls onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn();
    render(<TabBar tabs={tabs} activeTab="all" onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText('Active'));
    expect(onTabChange).toHaveBeenCalledWith('active');
  });

  test('marks the active tab button', () => {
    render(<TabBar tabs={tabs} activeTab="active" onTabChange={() => {}} />);
    const activeButton = screen.getByText('Active').closest('button');
    expect(activeButton?.className).toContain(styles['active-tab-button']);
  });
});
