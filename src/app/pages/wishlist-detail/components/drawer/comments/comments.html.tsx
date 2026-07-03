import React from 'react';
import { Drawer, MiniDrawer } from 'shared/ui';
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
    <Drawer
      isOpen={isOpen}
      position="right"
      title="Comments"
      onClose={onClose}
      overflowVisible={true}
      miniDrawer={
        <MiniDrawer
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
    </Drawer>
  );
};
