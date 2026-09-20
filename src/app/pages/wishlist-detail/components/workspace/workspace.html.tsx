import React from 'react';
import { ImportStrip } from 'features/items';
import { EnterPanel } from 'shared/ui';
import { JobProgressBox } from 'features/jobs';
import { Header } from '../header/header.component';
import { Controls } from '../controls/controls.component';
import { Items } from '../items/items.component';
import { Inspector } from '../inspector/inspector.component';
import styles from '../../page.module.css';
import type { TemplateProps } from './interfaces/template-props.interface';

export const WorkspaceTemplate: React.FC<TemplateProps> = ({
  wishlist,
  items,
  priorities,
  isOwner,
  isPublicGuest = false,
  onGoHome,
  isExpired,
  isArchived,
  isDeactivating,
  isActivating,
  isDeleting,
  confirmAction,
  setConfirmAction,
  handleDeactivateConfirm,
  handleActivateConfirm,
  handleDeleteConfirm,
  saveTitle,
  saveDate,
  formatDate,
  toggleAiEnabled,
  toggleWebSearchEnabled,
  toggleManualJobBackground,
  toggleAutoRollover,
  toggleAllowGroupFunds,
  isCommentsOpen,
  setIsCommentsOpen,
  setIsShareOpen,
  canCollaborate,
  isLocked,
  isImportOpen,
  setIsImportOpen,
  handleDuplicate,
  isDuplicating,
  importStripRef,
  reloadListContent,
  activeJob,
  onCancelJob,
  isCancellingJob,
  viewMode,
  supportsKanbanViewMode,
  handleSetViewMode,
  searchQuery,
  setSearchQuery,
  addItemWidget,
  itemsProps,
  isInspectorOpen,
  pageClassName,
  selectedItem,
  selectedItemPriorityLabel,
  setSelectedItemId,
  displayItems,
  itemActions,
  openItemEditor,
  openClaimerSubstitutionCreate,
  openClaimerSubstitutionEdit,
  deleteClaimerSubstitution,
  openSubstitutionEdit,
  deleteSubstitutionOption,
  handleItemTaggedClick,
  onLinkedItemsUnsupported,
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
}) => (
  <EnterPanel
    animation = {
      'fade'
    }
    className = {
      pageClassName
    }
  >
    <Header
      wishlist = {
        wishlist
      }
      items = {
        items
      }
      priorities = {
        priorities
      }
      isOwner = {
        isOwner
      }
      isPublicGuest = {
        isPublicGuest
      }
      onGoHome = {
        onGoHome
      }
      isExpired = {
        isExpired
      }
      isArchived = {
        isArchived
      }
      isDeactivating = {
        isDeactivating
      }
      isActivating = {
        isActivating
      }
      isDeleting = {
        isDeleting
      }
      confirmAction = {
        confirmAction
      }
      setConfirmAction = {
        setConfirmAction
      }
      handleDeactivateConfirm = {
        handleDeactivateConfirm
      }
      handleActivateConfirm = {
        handleActivateConfirm
      }
      handleDeleteConfirm = {
        handleDeleteConfirm
      }
      saveTitle = {
        saveTitle
      }
      saveDate = {
        saveDate
      }
      formatDate = {
        formatDate
      }
      toggleAiEnabled = {
        toggleAiEnabled || (() => {})
      }
      toggleWebSearchEnabled = {
        toggleWebSearchEnabled || (() => {})
      }
      toggleManualJobBackground = {
        toggleManualJobBackground || (() => {})
      }
      toggleAutoRollover = {
        toggleAutoRollover || (() => {})
      }
      toggleAllowGroupFunds = {
        toggleAllowGroupFunds || (() => {})
      }
      isCommentsOpen = {
        isCommentsOpen
      }
      setIsCommentsOpen = {
        setIsCommentsOpen
      }
      setIsShareOpen = {
        setIsShareOpen
      }
      canImport = {
        canCollaborate && !isLocked
      }
      isImportOpen = {
        isImportOpen
      }
      onImportToggle = {
        () => setIsImportOpen(!isImportOpen)
      }
      onDuplicate = {
        handleDuplicate
      }
      isDuplicating = {
        isDuplicating
      }
    />

    {!isPublicGuest && wishlist?.Id && canCollaborate && !isLocked ? (
      <ImportStrip
        ref = {
          importStripRef
        }
        mode = {
          'existing-list'
        }
        listId = {
          wishlist.Id
        }
        isExpanded = {
          isImportOpen
        }
        onImported = {
          () => {
            setIsImportOpen(false);
            void reloadListContent();
          }
        }
      />
    ) : null}

    {!isPublicGuest &&
    activeJob &&
    activeJob.Kind === 'wishlist-import' &&
    (activeJob.Status === 'queued' ||
      activeJob.Status === 'running' ||
      activeJob.Status === 'failed' ||
      activeJob.Status === 'cancelled') ? (
      <JobProgressBox
        job = {
          activeJob
        }
        onCancel = {
          onCancelJob
        }
        isCancelling = {
          isCancellingJob
        }
      />
    ) : null}

    {viewMode === 'grid' ? (
      <div
        className = {
          [
            styles['page__workspace'],
            isInspectorOpen ? styles['page__workspace--inspector-open'] : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
      >
        <div
          className = {
            styles['page__grid-column']
          }
        >
          <div
            className = {
              styles['page__workspace-header']
            }
          >
            <Controls
              viewMode = {
                viewMode
              }
              supportsKanbanViewMode = {
                supportsKanbanViewMode
              }
              handleSetViewMode = {
                handleSetViewMode
              }
              searchQuery = {
                searchQuery
              }
              setSearchQuery = {
                setSearchQuery
              }
              addItemWidget = {
                addItemWidget
              }
            />
          </div>
          <div
            className = {
              styles['page__grid-scroll']
            }
          >
            <Items
              {...itemsProps}
            />
          </div>
        </div>
        <div
          className = {
            [
              styles['page__inspector-column'],
              isInspectorOpen ? styles['page__inspector-column--open'] : '',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <Inspector
            selectedItem = {
              selectedItem
            }
            selectedItemPriorityLabel = {
              selectedItemPriorityLabel
            }
            setSelectedItemId = {
              setSelectedItemId
            }
            isCommentsOpen = {
              isCommentsOpen
            }
            setIsCommentsOpen = {
              setIsCommentsOpen
            }
            isPublicGuest = {
              isPublicGuest
            }
            wishlist = {
              wishlist
            }
            items = {
              items
            }
            displayItems = {
              displayItems
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
            canCollaborate = {
              canCollaborate
            }
            isLocked = {
              isLocked
            }
            itemActions = {
              itemActions
            }
            openItemEditor = {
              openItemEditor
            }
            openClaimerSubstitutionCreate = {
              openClaimerSubstitutionCreate
            }
            openClaimerSubstitutionEdit = {
              openClaimerSubstitutionEdit
            }
            deleteClaimerSubstitution = {
              deleteClaimerSubstitution
            }
            openSubstitutionEdit = {
              openSubstitutionEdit
            }
            deleteSubstitutionOption = {
              deleteSubstitutionOption
            }
            handleItemTaggedClick = {
              handleItemTaggedClick
            }
            onLinkedItemsUnsupported = {
              onLinkedItemsUnsupported
            }
            showDeletedComments = {
              showDeletedComments
            }
            onToggleShowDeletedComments = {
              onToggleShowDeletedComments
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
          />
        </div>
      </div>
    ) : (
      <div
        className = {
          styles['page__content']
        }
      >
        <div
          className = {
            styles['page__items-column']
          }
        >
          <Controls
            viewMode = {
              viewMode
            }
            supportsKanbanViewMode = {
              supportsKanbanViewMode
            }
            handleSetViewMode = {
              handleSetViewMode
            }
            searchQuery = {
              searchQuery
            }
            setSearchQuery = {
              setSearchQuery
            }
            addItemWidget = {
              addItemWidget
            }
          />
          <Items
            {...itemsProps}
          />
        </div>
      </div>
    )}
  </EnterPanel>
);
