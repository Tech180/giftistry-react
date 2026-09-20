import React from 'react';
import { Drawer } from 'shared/ui';
import { MiniDrawer } from 'features/items';
import { CommentSection, DeletedCommentsToggle } from 'features/comments';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './comments.module.css';

export const CommentsTemplate: React.FC<TemplateProps> = ({
  isDrawerOpen,
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
  isExpired,
  isArchived,
  autoRollover,
  handleItemTaggedClick,
  showDeletedComments,
  onToggleShowDeletedComments,
  drawerTitle,
  tagsLabel,
  drawerTaggingActive,
  drawerTaggedIds,
  onRemoveTaggedId,
}) => (
  <div className={styles.comments}>
    <Drawer
      isOpen = {
        isDrawerOpen
      }
      position = {
        'right'
      }
      title = {
        drawerTitle
      }
      onClose = {
        onClose
      }
      mobilePresentation = {
        'sheet'
      }
      overflowVisible = {
        true
      }
      headerExtra = {
        <DeletedCommentsToggle
          showDeletedComments = {
            showDeletedComments
          }
          onToggle = {
            onToggleShowDeletedComments
          }
        />
      }
      miniDrawer = {
        <MiniDrawer
          items = {
            items
          }
          selectedIds = {
            drawerTaggedIds
          }
          onRemoveId = {
            onRemoveTaggedId
          }
          onItemClick = {
            handleItemTaggedClick
          }
          isActive = {
            drawerTaggingActive
          }
          position = {
            'right'
          }
          label = {
            tagsLabel
          }
        />
      }
    >
      <CommentSection
        listId = {
          listId
        }
        listOwnerId = {
          listOwnerId
        }
        ownerUsername = {
          ownerUsername
        }
        ownerDisplayName = {
          ownerDisplayName
        }
        isOwner = {
          isOwner
        }
        isExpired = {
          isExpired
        }
        isArchived = {
          isArchived
        }
        autoRollover = {
          autoRollover
        }
        items = {
          items
        }
        onItemTaggedClick = {
          handleItemTaggedClick
        }
        isTaggingModeActive = {
          isTaggingModeActive
        }
        setIsTaggingModeActive = {
          setIsTaggingModeActive
        }
        taggedItemIds = {
          taggedItemIds
        }
        setTaggedItemIds = {
          setTaggedItemIds
        }
        isReplyTaggingModeActive = {
          isReplyTaggingModeActive
        }
        setIsReplyTaggingModeActive = {
          setIsReplyTaggingModeActive
        }
        replyTaggedItemIds = {
          replyTaggedItemIds
        }
        setReplyTaggedItemIds = {
          setReplyTaggedItemIds
        }
        showDeletedComments = {
          showDeletedComments
        }
      />
    </Drawer>
  </div>
);
