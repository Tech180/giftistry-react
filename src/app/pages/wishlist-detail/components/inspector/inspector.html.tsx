import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ItemShowcase } from 'features/items';
import { CommentSection, DeletedCommentsToggle } from 'features/comments';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './inspector.module.css';

export const InspectorTemplate: React.FC<TemplateProps> = ({
  selectedItem,
  setSelectedItemId,
  isCommentsOpen,
  setIsCommentsOpen,
  isPublicGuest = false,
  wishlist,
  displayItems,
  isOwner,
  isExpired,
  isArchived,
  showDeletedComments,
  onToggleShowDeletedComments,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
  handleItemTaggedClick,
  showcaseProps,
  categoryLabel,
  CategoryIcon,
}) => (
  <aside
    className = {
      styles['inspector']
    }
  >
    {selectedItem && showcaseProps ? (
      <div
        className = {
          `${styles['inspector__view']} ${styles['inspector__view--active']}`
        }
      >
        <div
          className = {
            styles['inspector__header']
          }
        >
          <span
            className = {
              styles['inspector__title']
            }
          >
            {CategoryIcon ? (
              <CategoryIcon
                size = {
                  16
                }
                aria-hidden = {
                  true
                }
              />
            ) : null}
            {categoryLabel}
          </span>
          <button
            type = {
              'button'
            }
            className = {
              styles['inspector__close']
            }
            onClick = {
              () => setSelectedItemId(null)
            }
          >
            <X
              size = {
                16
              }
            />
          </button>
        </div>
        <div
          className = {
            `${styles['inspector__body']} ${styles['inspector__body--showcase']}`
          }
        >
          <ItemShowcase
            key = {
              `preview-${selectedItem.Id}`
            }
            {...showcaseProps}
          />
        </div>
      </div>
    ) : null}

    {isCommentsOpen && !isPublicGuest ? (
      <div
        className = {
          `${styles['inspector__view']} ${styles['inspector__view--active']}`
        }
      >
        <div
          className = {
            styles['inspector__header']
          }
        >
          <span
            className = {
              styles['inspector__title']
            }
          >
            <MessageSquare
              size = {
                16
              }
            />
            {' '}
            Discussion
          </span>
          <div
            className = {
              styles['inspector__header-actions']
            }
          >
            <DeletedCommentsToggle
              showDeletedComments = {
                showDeletedComments
              }
              onToggle = {
                onToggleShowDeletedComments
              }
            />
            <button
              type = {
                'button'
              }
              className = {
                styles['inspector__close']
              }
              onClick = {
                () => setIsCommentsOpen(false)
              }
            >
              <X
                size = {
                  16
                }
              />
            </button>
          </div>
        </div>
        <div
          className = {
            styles['inspector__body']
          }
        >
          <CommentSection
            listId = {
              wishlist.Id
            }
            listOwnerId = {
              wishlist.UserId
            }
            ownerUsername = {
              wishlist.OwnerUsername
            }
            ownerDisplayName = {
              wishlist.OwnerFirstName
                ? wishlist.OwnerFirstName
                : wishlist.OwnerUsername
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
              wishlist.AutoRollover === true
            }
            items = {
              displayItems
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
        </div>
      </div>
    ) : null}
  </aside>
);
