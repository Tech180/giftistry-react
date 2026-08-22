import React, { useEffect, useRef, useState } from 'react';
import { MAX_VISIBLE_COMMENT_TAGS } from '../../../../constants/max-visible-comment-tags.constant';
import { TagsProps } from './interfaces/tags-props.interface';
import { TagsTemplate } from './tags.html';
import { getTagScrollState, scrollTagsByOne } from './utils/tag-scroll.util';

export const Tags: React.FC<TagsProps> = ({ taggedIds, items, onItemTaggedClick }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(taggedIds.length > MAX_VISIBLE_COMMENT_TAGS);
  const canScroll = taggedIds.length > MAX_VISIBLE_COMMENT_TAGS;

  const syncScrollState = () => {
    const element = listRef.current;
    if (!element || !canScroll) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    const nextState = getTagScrollState(element);
    setCanScrollUp(nextState.canScrollUp);
    setCanScrollDown(nextState.canScrollDown);
  };

  useEffect(() => {
    const element = listRef.current;
    if (!element || !canScroll) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    const applyState = () => {
      const nextState = getTagScrollState(element);
      setCanScrollUp(nextState.canScrollUp);
      setCanScrollDown(nextState.canScrollDown);
    };

    applyState();
    const observer = new ResizeObserver(applyState);
    observer.observe(element);
    return () => observer.disconnect();
  }, [canScroll, taggedIds]);

  if (taggedIds.length === 0) return null;

  const scrollUp = () => {
    if (listRef.current) scrollTagsByOne(listRef.current, -1);
  };

  const scrollDown = () => {
    if (listRef.current) scrollTagsByOne(listRef.current, 1);
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canScroll) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      scrollUp();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      scrollDown();
    }
  };

  return (
    <TagsTemplate
      taggedIds={taggedIds}
      items={items}
      onItemTaggedClick={onItemTaggedClick}
      listRef={listRef}
      canScroll={canScroll}
      canScrollUp={canScrollUp}
      canScrollDown={canScrollDown}
      onScroll={syncScrollState}
      onScrollUp={scrollUp}
      onScrollDown={scrollDown}
      onListKeyDown={handleListKeyDown}
    />
  );
};
