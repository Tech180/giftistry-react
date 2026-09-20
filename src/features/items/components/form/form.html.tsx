import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import { ItemPhotoGallery } from '../photo-gallery/item-photo-gallery.component';
import { LinkField } from './components/link-field/link-field.component';
import { CoreDetails } from './components/core-details/core-details.component';
import { Categories } from './components/categories/categories.component';
import { Notes } from './components/notes/notes.component';
import { CustomFields } from './components/custom-fields/custom-fields.component';
import { Variations } from './components/variations/variations.component';
import { Relations } from './components/relations/relations.component';
import { Visibility } from './components/visibility/visibility.component';
import styles from './form.module.css';

export const FormTemplate: React.FC<TemplateProps> = ({
  name,
  setName,
  description,
  setDescription,
  priorityWeight,
  setPriorityWeight,
  isHiddenIdea,
  setIsHiddenIdea,
  canCollaborate,
  isLoading,
  errorMsg,
  warningMsg,
  handleSubmit,
  linkUrl,
  setLinkUrl,
  linkCopied,
  onCopyLink,
  websiteName,
  setWebsiteName,
  category,
  setCategory,
  price,
  setPrice,
  isFavorite,
  setIsFavorite,
  isAutopopulating,
  handleScrapeClick,
  canUseWebSearchOnList = false,
  customFields,
  handleAddCustomField,
  handleRemoveCustomField,
  handleUpdateCustomField,
  editingCustomFieldNameId,
  onStartEditCustomFieldName,
  onFinishEditCustomFieldName,
  hasIncompleteCustomFields,
  showExtraFields,
  setShowExtraFields,
  renderedCategories,
  aiCategoryChips,
  aiCategoryIds,
  isAddingCustom,
  setIsAddingCustom,
  newCustomInput,
  setNewCustomInput,
  handleAddCustomCategory,
  handleDeleteCustomCategory,
  isScrapeButtonPulsing,
  isEdit,
  definitions,
  dynamicValues,
  isFieldVisible,
  handleUpdateDynamicValue,
  otherUsersCanSee,
  setOtherUsersCanSee,
  claimOnCreate,
  setClaimOnCreate,
  isMultiCount,
  isSuggestion,
  desiredQuantity,
  setDesiredQuantity,
  variations,
  setVariations,
  resolvedLinkedCount,
  resolvedRelatedCount,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
  wishlistItems = [],
  itemId,
  getFriendlyCategoryLabel,
  showFieldDefinitions,
  varName,
  setVarName,
  varQty,
  setVarQty,
  variationQtyMax,
  variationQtyDisabled = false,
  variationQtyAllowInfinity = false,
  varError,
  handleAddVariation,
  listShares,
  sharedWithUserIds,
  setSharedWithUserIds,
  visibilityMode,
  onVisibilityModeChange,
  canSummarizeNotes,
  isSummarizingNotes,
  canUndoSummarize,
  onSummarizeNotes,
  onUndoSummarize,
  canShowAi = false,
  showPhotoGallery,
  photoEntries,
  onPhotoEntriesChange,
  photoError,
  onPhotoError,
  readOnly = false,
  allowSubstitutions,
  setAllowSubstitutions,
  substitutionOptions,
  onOpenCreateSubstitution,
  onOpenEditSubstitution,
  onDeleteOwnerSubstitution,
  onReorderOwnerSubstitutions,
  substitutionEditor,
  isSubstitutionSurface,
  formId,
  readOnlyMetadataPredefined,
  readOnlyMetadataUserDefined,
  hasReadOnlyMetadata,
  metadataBadgeEmoji,
}) => {
  return (
    <form
      id = {
        formId
      }
      onSubmit = {
        handleSubmit
      }
      className = {
        styles.form
      }
    >
      {showPhotoGallery && (
        <>
          <ItemPhotoGallery
            photos = {
              photoEntries
            }
            onChange = {
              onPhotoEntriesChange
            }
            disabled = {
              isLoading || readOnly
            }
            errorMsg = {
              photoError
            }
            onError = {
              onPhotoError
            }
          />
          <div className={styles.divider} />
        </>
      )}

      {errorMsg && (
        <div className={`${styles.alert} animate-slide-up`} role="alert">
          <span>{errorMsg}</span>
        </div>
      )}
      {warningMsg && (
        <div className={`${styles['alert-warning']} animate-slide-up`} role="status">
          <AlertTriangle size={16} className={styles['alert-warning-icon']} aria-hidden />
          <span>{warningMsg}</span>
        </div>
      )}

      <LinkField
        linkUrl = {
          linkUrl
        }
        setLinkUrl = {
          setLinkUrl
        }
        linkCopied = {
          linkCopied
        }
        onCopyLink = {
          onCopyLink
        }
        readOnly = {
          readOnly
        }
        canUseWebSearchOnList = {
          canUseWebSearchOnList
        }
        isAutopopulating = {
          isAutopopulating
        }
        isSummarizingNotes = {
          isSummarizingNotes
        }
        handleScrapeClick = {
          handleScrapeClick
        }
        isScrapeButtonPulsing = {
          isScrapeButtonPulsing
        }
      />

      <fieldset
        disabled = {
          readOnly
        }
        className = {
          [
            styles['form-fieldset'],
            readOnly ? styles['form-fieldset--disabled'] : '',
          ]
            .filter(Boolean)
            .join(' ')
        }
      >
        <CoreDetails
          websiteName = {
            websiteName
          }
          setWebsiteName = {
            setWebsiteName
          }
          name = {
            name
          }
          setName = {
            setName
          }
          price = {
            price
          }
          setPrice = {
            setPrice
          }
          desiredQuantity = {
            desiredQuantity
          }
          setDesiredQuantity = {
            setDesiredQuantity
          }
          isFavorite = {
            isFavorite
          }
          setIsFavorite = {
            setIsFavorite
          }
          canCollaborate = {
            canCollaborate
          }
          hideFavorite = {
            isSubstitutionSurface
          }
        />

        <div className={styles.divider} />

        <div className={styles.section}>
          <Categories
            category = {
              category
            }
            setCategory = {
              setCategory
            }
            priorityWeight = {
              priorityWeight
            }
            setPriorityWeight = {
              setPriorityWeight
            }
            renderedCategories = {
              renderedCategories
            }
            aiCategoryChips = {
              aiCategoryChips
            }
            aiCategoryIds = {
              aiCategoryIds
            }
            isAddingCustom = {
              isAddingCustom
            }
            setIsAddingCustom = {
              setIsAddingCustom
            }
            newCustomInput = {
              newCustomInput
            }
            setNewCustomInput = {
              setNewCustomInput
            }
            handleAddCustomCategory = {
              handleAddCustomCategory
            }
            handleDeleteCustomCategory = {
              handleDeleteCustomCategory
            }
            canShowAi = {
              canShowAi
            }
            isSubstitutionSurface = {
              isSubstitutionSurface
            }
          />

          <Notes
            description = {
              description
            }
            setDescription = {
              setDescription
            }
            canSummarizeNotes = {
              canSummarizeNotes
            }
            isSummarizingNotes = {
              isSummarizingNotes
            }
            canUndoSummarize = {
              canUndoSummarize
            }
            onSummarizeNotes = {
              onSummarizeNotes
            }
            onUndoSummarize = {
              onUndoSummarize
            }
            isAutopopulating = {
              isAutopopulating
            }
            isLoading = {
              isLoading
            }
            readOnly = {
              readOnly
            }
            hasReadOnlyMetadata = {
              hasReadOnlyMetadata
            }
            readOnlyMetadataPredefined = {
              readOnlyMetadataPredefined
            }
            readOnlyMetadataUserDefined = {
              readOnlyMetadataUserDefined
            }
            metadataBadgeEmoji = {
              metadataBadgeEmoji
            }
          />

          {!readOnly && (
            <CustomFields
              category = {
                category
              }
              getFriendlyCategoryLabel = {
                getFriendlyCategoryLabel
              }
              showExtraFields = {
                showExtraFields
              }
              setShowExtraFields = {
                setShowExtraFields
              }
              hasIncompleteCustomFields = {
                hasIncompleteCustomFields
              }
              showFieldDefinitions = {
                showFieldDefinitions
              }
              definitions = {
                definitions
              }
              isFieldVisible = {
                isFieldVisible
              }
              dynamicValues = {
                dynamicValues
              }
              handleUpdateDynamicValue = {
                handleUpdateDynamicValue
              }
              customFields = {
                customFields
              }
              handleAddCustomField = {
                handleAddCustomField
              }
              handleRemoveCustomField = {
                handleRemoveCustomField
              }
              handleUpdateCustomField = {
                handleUpdateCustomField
              }
              editingCustomFieldNameId = {
                editingCustomFieldNameId
              }
              onStartEditCustomFieldName = {
                onStartEditCustomFieldName
              }
              onFinishEditCustomFieldName = {
                onFinishEditCustomFieldName
              }
            />
          )}

          <Variations
            isMultiCount = {
              isMultiCount
            }
            desiredQuantity = {
              desiredQuantity
            }
            variations = {
              variations
            }
            setVariations = {
              setVariations
            }
            varName = {
              varName
            }
            setVarName = {
              setVarName
            }
            varQty = {
              varQty
            }
            setVarQty = {
              setVarQty
            }
            variationQtyMax = {
              variationQtyMax
            }
            variationQtyDisabled = {
              variationQtyDisabled
            }
            variationQtyAllowInfinity = {
              variationQtyAllowInfinity
            }
            varError = {
              varError
            }
            handleAddVariation = {
              handleAddVariation
            }
          />

          <Relations
            wishlistItems = {
              wishlistItems
            }
            itemId = {
              itemId
            }
            readOnly = {
              readOnly
            }
            isMultiCount = {
              isMultiCount
            }
            isSuggestion = {
              isSuggestion
            }
            isSubstitutionSurface = {
              isSubstitutionSurface
            }
            resolvedLinkedCount = {
              resolvedLinkedCount
            }
            resolvedRelatedCount = {
              resolvedRelatedCount
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
          />
        </div>

        <Visibility
          canCollaborate = {
            canCollaborate
          }
          isSuggestion = {
            isSuggestion
          }
          isLoading = {
            isLoading
          }
          readOnly = {
            readOnly
          }
          isEdit = {
            isEdit
          }
          isHiddenIdea = {
            isHiddenIdea
          }
          setIsHiddenIdea = {
            setIsHiddenIdea
          }
          otherUsersCanSee = {
            otherUsersCanSee
          }
          setOtherUsersCanSee = {
            setOtherUsersCanSee
          }
          claimOnCreate = {
            claimOnCreate
          }
          setClaimOnCreate = {
            setClaimOnCreate
          }
          itemId = {
            itemId
          }
          allowSubstitutions = {
            allowSubstitutions
          }
          setAllowSubstitutions = {
            setAllowSubstitutions
          }
          substitutionOptions = {
            substitutionOptions
          }
          onOpenCreateSubstitution = {
            onOpenCreateSubstitution
          }
          onOpenEditSubstitution = {
            onOpenEditSubstitution
          }
          onDeleteOwnerSubstitution = {
            onDeleteOwnerSubstitution
          }
          onReorderOwnerSubstitutions = {
            onReorderOwnerSubstitutions
          }
          listShares = {
            listShares
          }
          sharedWithUserIds = {
            sharedWithUserIds
          }
          setSharedWithUserIds = {
            setSharedWithUserIds
          }
          visibilityMode = {
            visibilityMode
          }
          onVisibilityModeChange = {
            onVisibilityModeChange
          }
          substitutionEditor = {
            substitutionEditor
          }
        />
      </fieldset>
    </form>
  );
};
