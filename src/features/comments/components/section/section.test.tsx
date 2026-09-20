import React, { createRef } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SectionTemplate } from './section.html';
import type { TemplateProps } from './interfaces/template-props.interface';
import { DEFAULT_COMMENT_VISIBILITY } from '../../constants/default-comment-visibility.constant';

const baseProps: TemplateProps = {
  isOwner: false,
  isAuthenticated: false,
  canPostComments: false,
  currentUserId: undefined,
  participants: [],
  comments: [],
  isLoading: false,
  displayError: null,
  content: '',
  setContent: vi.fn(),
  commenterName: '',
  setCommenterName: vi.fn(),
  commentVisibility: DEFAULT_COMMENT_VISIBILITY,
  setCommentVisibility: vi.fn(),
  isRollover: false,
  setIsRollover: vi.fn(),
  isSubmitLoading: false,
  handleSubmit: vi.fn(),
  formatDate: () => '',
  items: [],
  onlineUsers: [],
  typingUsers: [],
  handleSelectTagItem: vi.fn(),
  isTaggingModeActive: false,
  setIsTaggingModeActive: vi.fn(),
  taggedItemIds: [],
  setTaggedItemIds: vi.fn(),
  handleDeleteComment: vi.fn(),
  deletingCommentId: null,
  setDeletingCommentId: vi.fn(),
  isAnonymous: false,
  setIsAnonymous: vi.fn(),
  imageUrl: null,
  setImageUrl: vi.fn(),
  parentComments: [],
  repliesMap: {},
  handleReplySubmit: vi.fn(),
  toggleReaction: vi.fn(),
  activeReplyId: null,
  onReplyOpen: vi.fn(),
  isReplyTaggingModeActive: false,
  setIsReplyTaggingModeActive: vi.fn(),
  replyTaggedItemIds: [],
  setReplyTaggedItemIds: vi.fn(),
  listContainerRef: createRef<HTMLDivElement>(),
};

function renderSection(overrides: Partial<TemplateProps> = {}) {
  return render(
    <MemoryRouter>
      <SectionTemplate {...baseProps} {...overrides} />
    </MemoryRouter>,
  );
}

describe('SectionTemplate', () => {
  test('shows empty copy when there are no parent comments', () => {
    renderSection();
    expect(screen.getByText(/No comments yet/i)).toBeInTheDocument();
  });

  test('shows displayError when provided', () => {
    renderSection({ displayError: 'Failed to load comments.' });
    expect(screen.getByText('Failed to load comments.')).toBeInTheDocument();
  });
});
