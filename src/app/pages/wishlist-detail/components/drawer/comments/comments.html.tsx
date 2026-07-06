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
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
  listId,
  listOwnerId,
  ownerUsername,
  ownerDisplayName,
  isOwner,
  handleItemTaggedClick,
}) => {
  const drawerTaggingActive = isTaggingModeActive || isReplyTaggingModeActive;
  const drawerTaggedIds = isReplyTaggingModeActive ? replyTaggedItemIds : taggedItemIds;

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
          selectedIds={drawerTaggedIds}
          onRemoveId={(id) => {
            if (isReplyTaggingModeActive) {
              setReplyTaggedItemIds(replyTaggedItemIds.filter((tagId) => tagId !== id));
            } else {
              setTaggedItemIds(taggedItemIds.filter((tagId) => tagId !== id));
            }
          }}
          isActive={drawerTaggingActive}
          position="right"
          label="Tags"
        />
      }
    >
      <CommentSection
        listId={listId}
        listOwnerId={listOwnerId}
        ownerUsername={ownerUsername}
        ownerDisplayName={ownerDisplayName}
        isOwner={isOwner}
        items={items}
        onItemTaggedClick={handleItemTaggedClick}
        isTaggingModeActive={isTaggingModeActive}
        setIsTaggingModeActive={setIsTaggingModeActive}
        taggedItemIds={taggedItemIds}
        setTaggedItemIds={setTaggedItemIds}
        isReplyTaggingModeActive={isReplyTaggingModeActive}
        setIsReplyTaggingModeActive={setIsReplyTaggingModeActive}
        replyTaggedItemIds={replyTaggedItemIds}
        setReplyTaggedItemIds={setReplyTaggedItemIds}
      />
    </Drawer>
  );
};
