import React from 'react';
import { Sidebar, MiniSidebar } from 'shared/ui';
import { CommentSection } from 'features/comments';
import { CommentsTemplateProps } from './interfaces/comments-template-props.interface';

export const CommentsTemplate: React.FC<CommentsTemplateProps> = ({
  isOpen,
  onClose,
  items,
  taggedItemIds,
  setTaggedItemIds,
  isTaggingModeActive,
  setIsTaggingModeActive,
  listId,
  isOwner,
  handleItemTaggedClick,
}) => {
  return (
    <Sidebar
      isOpen={isOpen}
      position="right"
      title="Comments"
      onClose={onClose}
      overflowVisible={true}
      miniSidebar={
        <MiniSidebar
          items={items}
          selectedIds={taggedItemIds}
          onRemoveId={(id) => setTaggedItemIds(taggedItemIds.filter((tid) => tid !== id))}
          isActive={isTaggingModeActive}
          position="right"
          label="Tags"
        />
      }
    >
      <CommentSection
        listId={listId}
        isOwner={isOwner}
        items={items}
        onItemTaggedClick={handleItemTaggedClick}
        isTaggingModeActive={isTaggingModeActive}
        setIsTaggingModeActive={setIsTaggingModeActive}
        taggedItemIds={taggedItemIds}
        setTaggedItemIds={setTaggedItemIds}
      />
    </Sidebar>
  );
};
