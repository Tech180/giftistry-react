import React from 'react';
import { Copy } from 'lucide-react';
import { Drawer, Button, AiStatusBadge } from 'shared/ui';
import { AddItemForm, ADD_ITEM_FORM_ID, SUBSTITUTION_FORM_ID } from 'features/items';
import { TOUR_TARGETS } from 'features/tour';
import { VIEW_MODE_BANNER_DESCRIPTION } from 'features/items/constants/view-mode-banner.constant';
import { AssociationRails } from './components/association-rails/association-rails.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './add-item.module.css';

export const AddItemTemplate: React.FC<TemplateProps> = ({
  isOpen,
  isDrawerOpen,
  isView,
  isEdit,
  isSubstitutionMode,
  title,
  titleIcon,
  closeIcon,
  closeAriaLabel,
  formItem,
  existingCategories,
  linkableItems,
  resolvedLinkedItems,
  resolvedRelatedItems,
  linkedItemIds,
  setLinkedItemIds,
  relatedItemIds,
  setRelatedItemIds,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
  handleLinkingAudienceChange,
  isOwner,
  canCollaborate,
  listId,
  listAiEnabled,
  listManualJobBackground,
  canUseWebSearchOnList,
  canShowAi,
  listShares,
  onClose,
  onSuccess,
  onAutoEnrichStarted,
  setEditingItemDraft,
  loadData,
  isLoading,
  isFormDirty,
  onFormLoadingChange,
  onFormDirtyChange,
  onItemTaggedClick,
  autoOpenClaimerSubstitutionNonce,
  autoOpenClaimerSubstitutionEditNonce,
  autoOpenClaimerSubstitutionEditId,
  substitutionChrome,
  substitutionExitNonce,
  onSubstitutionChromeChange,
  onCopyMarkdown,
  onDrawerClose,
  onDismissSubstitution,
  showAiBadge,
  showCopyButton,
  showSuggestionBanner,
  showViewModeBanner,
  showSubstitutionBanner,
}) => (
  <Drawer
    isOpen = {
      isDrawerOpen
    }
    position = {
      'left'
    }
    title = {
      title
    }
    titleIcon = {
      titleIcon
    }
    mobilePresentation = {
      'sheet'
    }
    closeIcon = {
      closeIcon
    }
    closeAriaLabel = {
      closeAriaLabel
    }
    headerExtra = {
      <>
        {showAiBadge ? (
          <AiStatusBadge
            size = {
              'compact'
            }
            enabled = {
              listAiEnabled
            }
            ariaLabelEnabled = {
              'AI reviews enabled for this list'
            }
            ariaLabelDisabled = {
              'AI reviews disabled for this list'
            }
          />
        ) : null}
        {showCopyButton ? (
          <button
            type = {
              'button'
            }
            className = {
              styles['add-item__copy-markdown-btn']
            }
            onClick = {
              onCopyMarkdown
            }
            title = {
              'Copy item as Markdown'
            }
            aria-label = {
              'Copy item as Markdown'
            }
          >
            <Copy
              size = {
                16
              }
            />
          </button>
        ) : null}
      </>
    }
    onClose = {
      onDrawerClose
    }
    overflowVisible = {
      true
    }
    miniDrawer = {
      isSubstitutionMode ? undefined : (
        <AssociationRails
          linkableItems = {
            linkableItems
          }
          linkedItemIds = {
            linkedItemIds
          }
          relatedItemIds = {
            relatedItemIds
          }
          setLinkedItemIds = {
            setLinkedItemIds
          }
          setRelatedItemIds = {
            setRelatedItemIds
          }
          onItemTaggedClick = {
            onItemTaggedClick
          }
          isLinkingModeActive = {
            isLinkingModeActive
          }
          isRelatingModeActive = {
            isRelatingModeActive
          }
          readOnly = {
            isView
          }
        />
      )
    }
    footer = {
      isView && !isSubstitutionMode ? (
        <Button
          type = {
            'button'
          }
          variant = {
            'secondary'
          }
          onClick = {
            onClose
          }
        >
          Close
        </Button>
      ) : isSubstitutionMode && substitutionChrome ? (
        <>
          <Button
            type = {
              'button'
            }
            variant = {
              'secondary'
            }
            onClick = {
              onDismissSubstitution
            }
            disabled = {
              substitutionChrome.isSaving
            }
          >
            Cancel
          </Button>
          <Button
            type = {
              'submit'
            }
            form = {
              SUBSTITUTION_FORM_ID
            }
            variant = {
              'primary'
            }
            isLoading = {
              substitutionChrome.isSaving
            }
            disabled = {
              !substitutionChrome.canSubmit
            }
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <Button
            type = {
              'button'
            }
            variant = {
              'secondary'
            }
            onClick = {
              onClose
            }
            disabled = {
              isLoading
            }
          >
            Cancel
          </Button>
          <Button
            type = {
              'submit'
            }
            form = {
              ADD_ITEM_FORM_ID
            }
            variant = {
              'primary'
            }
            isLoading = {
              isLoading
            }
            disabled = {
              isEdit && !isFormDirty
            }
            data-tour = {
              TOUR_TARGETS.addItemSave
            }
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </>
      )
    }
  >
    {showSubstitutionBanner ? (
      <p className={styles['add-item__substitution-banner']} role="status">
        Substitution item
      </p>
    ) : null}
    {showSuggestionBanner ? (
      <p className={styles['add-item__suggestion-banner']} role="status">
        Suggestion
      </p>
    ) : null}
    {showViewModeBanner ? (
      <div className={styles['add-item__view-mode-banner']} role="status">
        <span className={styles['add-item__view-mode-banner-description']}>
          {VIEW_MODE_BANNER_DESCRIPTION}
        </span>
      </div>
    ) : null}
    <AddItemForm
      key = {
        formItem?.Id ?? 'add'
      }
      listId = {
        listId
      }
      isOwner = {
        isOwner
      }
      canCollaborate = {
        canCollaborate
      }
      item = {
        formItem
      }
      readOnly = {
        isView
      }
      existingCategories = {
        existingCategories
      }
      onDraftChange = {
        isView ? undefined : setEditingItemDraft
      }
      wishlistItems = {
        linkableItems
      }
      linkedItemIds = {
        linkedItemIds
      }
      setLinkedItemIds = {
        setLinkedItemIds
      }
      resolvedLinkedCount = {
        resolvedLinkedItems.length
      }
      relatedItemIds = {
        relatedItemIds
      }
      resolvedRelatedCount = {
        resolvedRelatedItems.length
      }
      isLinkingModeActive = {
        isLinkingModeActive
      }
      setIsLinkingModeActive = {
        setIsLinkingModeActive
      }
      isRelatingModeActive = {
        isRelatingModeActive
      }
      setIsRelatingModeActive = {
        setIsRelatingModeActive
      }
      onLinkingAudienceChange = {
        handleLinkingAudienceChange
      }
      onPriorityChange = {
        loadData
      }
      onItemEnriched = {
        loadData
      }
      onAutoEnrichStarted = {
        onAutoEnrichStarted
      }
      isOpen = {
        isOpen
      }
      onSuccess = {
        onSuccess
      }
      listShares = {
        listShares
      }
      onLoadingChange = {
        onFormLoadingChange
      }
      onDirtyChange = {
        onFormDirtyChange
      }
      canShowAi = {
        canShowAi
      }
      listAiEnabled = {
        listAiEnabled
      }
      listManualJobBackground = {
        listManualJobBackground
      }
      canUseWebSearchOnList = {
        canUseWebSearchOnList
      }
      onSubstitutionChromeChange = {
        onSubstitutionChromeChange
      }
      substitutionExitNonce = {
        substitutionExitNonce
      }
      autoOpenClaimerSubstitutionNonce = {
        autoOpenClaimerSubstitutionNonce
      }
      autoOpenClaimerSubstitutionEditNonce = {
        autoOpenClaimerSubstitutionEditNonce
      }
      autoOpenClaimerSubstitutionEditId = {
        autoOpenClaimerSubstitutionEditId
      }
    />
  </Drawer>
);
