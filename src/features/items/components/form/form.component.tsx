import React from 'react';
import type { Props } from './interfaces/props.interface';
import { FormTemplate } from './form.html';
import { useForm } from './hooks/use-form';

export const Form: React.FC<Props> = (props) => {
  const t = useForm(props);

  return (
    <FormTemplate
      name = {
        t.name
      }
      setName = {
        t.setName
      }
      description = {
        t.description
      }
      setDescription = {
        t.setDescription
      }
      priorityWeight = {
        t.priorityWeight
      }
      setPriorityWeight = {
        t.setPriorityWeight
      }
      isHiddenIdea = {
        t.isHiddenIdea
      }
      setIsHiddenIdea = {
        t.setIsHiddenIdea
      }
      canCollaborate = {
        t.canCollaborate
      }
      isLoading = {
        t.isLoading
      }
      errorMsg = {
        t.errorMsg
      }
      warningMsg = {
        t.warningMsg
      }
      handleSubmit = {
        t.handleSubmit
      }
      formId = {
        t.formId
      }
      linkUrl = {
        t.linkUrl
      }
      setLinkUrl = {
        t.setLinkUrl
      }
      linkCopied = {
        t.linkCopied
      }
      onCopyLink = {
        t.onCopyLink
      }
      websiteName = {
        t.websiteName
      }
      setWebsiteName = {
        t.setWebsiteName
      }
      category = {
        t.category
      }
      setCategory = {
        t.setCategory
      }
      price = {
        t.price
      }
      setPrice = {
        t.setPrice
      }
      isFavorite = {
        t.isFavorite
      }
      setIsFavorite = {
        t.setIsFavorite
      }
      isAutopopulating = {
        t.isAutopopulating
      }
      handleScrapeClick = {
        t.handleScrapeClick
      }
      canUseWebSearchOnList = {
        t.canUseWebSearchOnList
      }
      customFields = {
        t.customFields
      }
      handleAddCustomField = {
        t.handleAddCustomField
      }
      handleRemoveCustomField = {
        t.handleRemoveCustomField
      }
      handleUpdateCustomField = {
        t.handleUpdateCustomField
      }
      editingCustomFieldNameId = {
        t.editingCustomFieldNameId
      }
      onStartEditCustomFieldName = {
        t.onStartEditCustomFieldName
      }
      onFinishEditCustomFieldName = {
        t.onFinishEditCustomFieldName
      }
      hasIncompleteCustomFields = {
        t.hasIncompleteCustomFields
      }
      showExtraFields = {
        t.showExtraFields
      }
      setShowExtraFields = {
        t.setShowExtraFields
      }
      renderedCategories = {
        t.renderedCategories
      }
      aiCategoryChips = {
        t.aiCategoryChips
      }
      aiCategoryIds = {
        t.aiCategoryIds
      }
      isAddingCustom = {
        t.isAddingCustom
      }
      setIsAddingCustom = {
        t.setIsAddingCustom
      }
      newCustomInput = {
        t.newCustomInput
      }
      setNewCustomInput = {
        t.setNewCustomInput
      }
      handleDeleteCustomCategory = {
        t.handleDeleteCustomCategory
      }
      handleAddCustomCategory = {
        t.handleAddCustomCategory
      }
      isScrapeButtonPulsing = {
        t.isScrapeButtonPulsing
      }
      isEdit = {
        t.isEdit
      }
      definitions = {
        t.definitions
      }
      dynamicValues = {
        t.dynamicValues
      }
      isFieldVisible = {
        t.isFieldVisible
      }
      handleUpdateDynamicValue = {
        t.handleUpdateDynamicValue
      }
      currentUserId = {
        t.currentUserId
      }
      otherUsersCanSee = {
        t.otherUsersCanSee
      }
      setOtherUsersCanSee = {
        t.setOtherUsersCanSee
      }
      claimOnCreate = {
        t.claimOnCreate
      }
      setClaimOnCreate = {
        t.setClaimOnCreate
      }
      isMultiCount = {
        t.isMultiCount
      }
      isSuggestion = {
        t.isSuggestion
      }
      desiredQuantity = {
        t.desiredQuantity
      }
      setDesiredQuantity = {
        t.setDesiredQuantity
      }
      variations = {
        t.variations
      }
      setVariations = {
        t.setVariations
      }
      linkedItemIds = {
        t.linkedItemIds
      }
      resolvedLinkedCount = {
        t.resolvedLinkedCount
      }
      relatedItemIds = {
        t.relatedItemIds
      }
      resolvedRelatedCount = {
        t.resolvedRelatedCount
      }
      wishlistItems = {
        t.wishlistItems
      }
      itemId = {
        t.itemId
      }
      isLinkingModeActive = {
        t.isLinkingModeActive
      }
      setIsLinkingModeActive = {
        t.setIsLinkingModeActive
      }
      isRelatingModeActive = {
        t.isRelatingModeActive
      }
      setIsRelatingModeActive = {
        t.setIsRelatingModeActive
      }
      getFriendlyCategoryLabel = {
        t.getFriendlyCategoryLabel
      }
      showFieldDefinitions = {
        t.showFieldDefinitions
      }
      varName = {
        t.varName
      }
      setVarName = {
        t.setVarName
      }
      varQty = {
        t.varQty
      }
      setVarQty = {
        t.setVarQty
      }
      variationQtyMax = {
        t.variationQtyMax
      }
      variationQtyDisabled = {
        t.variationQtyDisabled
      }
      variationQtyAllowInfinity = {
        t.variationQtyAllowInfinity
      }
      varError = {
        t.varError
      }
      handleAddVariation = {
        t.handleAddVariation
      }
      listShares = {
        t.listShares
      }
      sharedWithUserIds = {
        t.sharedWithUserIds
      }
      setSharedWithUserIds = {
        t.setSharedWithUserIds
      }
      visibilityMode = {
        t.visibilityMode
      }
      onVisibilityModeChange = {
        t.onVisibilityModeChange
      }
      canShowAi = {
        t.canShowAi
      }
      canSummarizeNotes = {
        t.canSummarizeNotes
      }
      isSummarizingNotes = {
        t.isSummarizingNotes
      }
      canUndoSummarize = {
        t.canUndoSummarize
      }
      onSummarizeNotes = {
        t.onSummarizeNotes
      }
      onUndoSummarize = {
        t.onUndoSummarize
      }
      showPhotoGallery = {
        t.showPhotoGallery
      }
      photoEntries = {
        t.photoEntries
      }
      onPhotoEntriesChange = {
        t.onPhotoEntriesChange
      }
      photoError = {
        t.photoError
      }
      onPhotoError = {
        t.onPhotoError
      }
      readOnly = {
        t.readOnly
      }
      readOnlyMetadataPredefined = {
        t.readOnlyMetadataPredefined
      }
      readOnlyMetadataUserDefined = {
        t.readOnlyMetadataUserDefined
      }
      hasReadOnlyMetadata = {
        t.hasReadOnlyMetadata
      }
      metadataBadgeEmoji = {
        t.metadataBadgeEmoji
      }
      allowSubstitutions = {
        t.allowSubstitutions
      }
      setAllowSubstitutions = {
        t.setAllowSubstitutions
      }
      substitutionOptions = {
        t.substitutionOptions
      }
      onOpenCreateSubstitution = {
        t.onOpenCreateSubstitution
      }
      onOpenEditSubstitution = {
        t.onOpenEditSubstitution
      }
      onDeleteOwnerSubstitution = {
        t.onDeleteOwnerSubstitution
      }
      onReorderOwnerSubstitutions = {
        t.onReorderOwnerSubstitutions
      }
      substitutionEditor = {
        t.substitutionEditor
      }
      isSubstitutionSurface = {
        t.isSubstitutionSurface
      }
    />
  );
};
