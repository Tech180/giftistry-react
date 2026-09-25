import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spotlight } from './spotlight.component';

describe('Spotlight', () => {
  test('renders welcome mode with BrandMark and tutorial toggle', () => {
    render(
      <Spotlight
        mode = {
          'welcome'
        }
        targetRect = {
          null
        }
        title = {
          'Welcome to Giftistry'
        }
        body = {
          'A short tour.'
        }
        isDialog = {
          true
        }
        features = {
          [
            {
              title: 'Sample list',
              description: 'See friends using a list.',
              icon: <span>gift</span>,
            },
          ]
        }
        tutorialEnabled = {
          true
        }
        onTutorialEnabledChange = {
          vi.fn()
        }
        onStart = {
          vi.fn()
        }
        onClose = {
          vi.fn()
        }
      />
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Welcome to Giftistry')).toBeTruthy();
    expect(screen.getByText('Sample list')).toBeTruthy();
    expect(screen.getByText('Include hands-on tutorial')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Start tutorial' })).toBeTruthy();
  });

  test('renders step progress segments and hint', () => {
    render(
      <Spotlight
        mode = {
          'step'
        }
        targetRect = {
          { top: 10, left: 10, width: 40, height: 20 }
        }
        title = {
          'New Wishlist'
        }
        body = {
          'Click to open the form.'
        }
        progress = {
          {
            chapterIndex: 1,
            chapterCount: 3,
            chapterTitle: 'Create your list',
            chapterFillPercent: 40,
          }
        }
        interactionHint = {
          'Click New Wishlist to continue'
        }
        showNext = {
          false
        }
        showSkip = {
          true
        }
        onSkip = {
          vi.fn()
        }
      />
    );

    expect(screen.getByText('Chapter 2: Create your list')).toBeTruthy();
    expect(screen.getByText('Click New Wishlist to continue')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  });

  test('renders interstitial with continue and exit', () => {
    render(
      <Spotlight
        mode = {
          'interstitial'
        }
        targetRect = {
          null
        }
        title = {
          'You are set'
        }
        body = {
          'Continue or finish.'
        }
        isDialog = {
          true
        }
        continueLabel = {
          'Continue'
        }
        exitLabel = {
          'I’m done for now'
        }
        onContinue = {
          vi.fn()
        }
        onExit = {
          vi.fn()
        }
      />
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'I’m done for now' })).toBeTruthy();
  });
});
