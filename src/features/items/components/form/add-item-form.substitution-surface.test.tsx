import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddItemFormTemplate, ADD_ITEM_FORM_ID } from './add-item-form.html';
import { SUBSTITUTION_FORM_ID } from '../../constants/substitution-form.constant';
import type { AddItemFormTemplateProps } from '../../interfaces/add-item-form-template-props.interface';

vi.mock('../audience-picker', () => ({
  AudiencePicker: () => <div data-testid="audience-picker">Audience</div>,
}));

vi.mock('../photo-gallery/item-photo-gallery.component', () => ({
  ItemPhotoGallery: () => <div data-testid="photo-gallery">Photos</div>,
}));

vi.mock('../item-presentation/substitution', () => ({
  SubstitutionManager: () => (
    <div data-testid="substitution-manager">
      <span>Allow substitutions</span>
    </div>
  ),
}));

const baseProps = {
  name: 'Gift',
  setName: vi.fn(),
  description: '',
  setDescription: vi.fn(),
  priorityWeight: '',
  setPriorityWeight: vi.fn(),
  isHiddenIdea: false,
  setIsHiddenIdea: vi.fn(),
  isOwner: true,
  isLoading: false,
  errorMsg: null,
  warningMsg: null,
  handleSubmit: vi.fn(),
  formId: ADD_ITEM_FORM_ID,
  linkUrl: '',
  setLinkUrl: vi.fn(),
  websiteName: '',
  setWebsiteName: vi.fn(),
  category: 'uncategorized',
  setCategory: vi.fn(),
  price: '',
  setPrice: vi.fn(),
  isFavorite: false,
  setIsFavorite: vi.fn(),
  isAutopopulating: false,
  hasScraped: false,
  handleScrapeClick: vi.fn(),
  customFields: [],
  handleAddCustomField: vi.fn(),
  handleRemoveCustomField: vi.fn(),
  handleUpdateCustomField: vi.fn(),
  editingCustomFieldNameId: null,
  onStartEditCustomFieldName: vi.fn(),
  onFinishEditCustomFieldName: vi.fn(),
  hasIncompleteCustomFields: false,
  showExtraFields: false,
  setShowExtraFields: vi.fn(),
  renderedCategories: [],
  aiCategoryChips: [],
  aiCategoryIds: new Set<string>(),
  isAddingCustom: false,
  setIsAddingCustom: vi.fn(),
  newCustomInput: '',
  setNewCustomInput: vi.fn(),
  handleAddCustomCategory: vi.fn(),
  handleDeleteCustomCategory: vi.fn(),
  isScrapeButtonPulsing: false,
  isEdit: true,
  definitions: [],
  dynamicValues: {},
  isFieldVisible: () => true,
  handleUpdateDynamicValue: vi.fn(),
  otherUsersCanSee: true,
  setOtherUsersCanSee: vi.fn(),
  claimOnCreate: false,
  setClaimOnCreate: vi.fn(),
  isMultiCount: false,
  isSuggestion: false,
  desiredQuantity: 1 as const,
  setDesiredQuantity: vi.fn(),
  variations: [],
  setVariations: vi.fn(),
  linkedItemIds: [],
  resolvedLinkedCount: 0,
  relatedItemIds: [],
  resolvedRelatedCount: 0,
  wishlistItems: [],
  itemId: 'item-1',
  isLinkingModeActive: false,
  setIsLinkingModeActive: vi.fn(),
  isRelatingModeActive: false,
  setIsRelatingModeActive: vi.fn(),
  getFriendlyCategoryLabel: (id: string) => id,
  showFieldDefinitions: false,
  varName: '',
  setVarName: vi.fn(),
  varQty: 1 as const,
  setVarQty: vi.fn(),
  variationQtyMax: undefined,
  variationQtyDisabled: false,
  variationQtyAllowInfinity: false,
  varError: null,
  handleAddVariation: vi.fn(),
  listShares: [],
  sharedWithUserIds: [],
  setSharedWithUserIds: vi.fn(),
  visibilityMode: 'everyone' as const,
  onVisibilityModeChange: vi.fn(),
  canSummarizeNotes: false,
  isSummarizingNotes: false,
  canUndoSummarize: false,
  onSummarizeNotes: vi.fn(),
  onUndoSummarize: vi.fn(),
  showPhotoGallery: true,
  photoEntries: [],
  onPhotoEntriesChange: vi.fn(),
  photoError: null,
  onPhotoError: vi.fn(),
  allowSubstitutions: true,
  setAllowSubstitutions: vi.fn(),
  substitutionOptions: [],
  onOpenCreateSubstitution: vi.fn(),
  onOpenEditSubstitution: vi.fn(),
  onDeleteOwnerSubstitution: vi.fn(),
  onReorderOwnerSubstitutions: vi.fn(),
  substitutionEditor: null,
  readOnlyMetadataPredefined: [],
  readOnlyMetadataUserDefined: [],
  hasReadOnlyMetadata: false,
  metadataBadgeEmoji: {},
} satisfies AddItemFormTemplateProps;

describe('AddItemFormTemplate substitution surface', () => {
  it('shows product fields and hides manager/audience when editing a substitution', () => {
    render(
      <AddItemFormTemplate
        {...baseProps}
        formId={SUBSTITUTION_FORM_ID}
        substitutionEditor={{ mode: 'create', kind: 'owner_approved' }}
      />
    );

    expect(document.getElementById(SUBSTITUTION_FORM_ID)).toBeTruthy();
    expect(screen.getByTestId('photo-gallery')).toBeInTheDocument();
    expect(screen.getByText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Sony WH-1000XM5/i)).toBeInTheDocument();
    expect(screen.queryByTestId('substitution-manager')).not.toBeInTheDocument();
    expect(screen.queryByTestId('audience-picker')).not.toBeInTheDocument();
    expect(screen.queryByText('Allow substitutions')).not.toBeInTheDocument();
    expect(screen.queryByText('Category')).not.toBeInTheDocument();
    expect(screen.queryByText('Favorite')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Decrease priority')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Increase priority')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Priority weight')).not.toBeInTheDocument();
  });

  it('shows Visible to list owner and Claim immediately for claimer create', () => {
    render(
      <AddItemFormTemplate
        {...baseProps}
        isOwner={false}
        isEdit={false}
        formId={SUBSTITUTION_FORM_ID}
        substitutionEditor={{ mode: 'create', kind: 'claimer_custom' }}
      />
    );

    expect(screen.getByLabelText('Visible to list owner')).toBeInTheDocument();
    expect(screen.getByLabelText('Claim this Item Immediately')).toBeInTheDocument();
    expect(screen.queryByTestId('audience-picker')).not.toBeInTheDocument();
  });

  it('shows Visible to list owner but not Claim immediately when editing claimer custom', () => {
    render(
      <AddItemFormTemplate
        {...baseProps}
        isOwner={false}
        isEdit
        formId={SUBSTITUTION_FORM_ID}
        substitutionEditor={{
          mode: 'edit',
          option: {
            Id: 'sub-1',
            Kind: 'claimer_custom',
            SortOrder: 0,
            CreatedByUserId: 'u1',
            Item: {
              Id: 'child-1',
              Name: 'Alt',
              Description: null,
              Links: [],
              Photos: [],
              Claims: [],
              IsClaimed: false,
              IsHiddenIdea: true,
            },
          },
        }}
      />
    );

    expect(screen.getByLabelText('Visible to list owner')).toBeInTheDocument();
    expect(screen.queryByLabelText('Claim this Item Immediately')).not.toBeInTheDocument();
  });

  it('shows substitution manager on the parent item surface', () => {
    render(<AddItemFormTemplate {...baseProps} />);

    expect(document.getElementById(ADD_ITEM_FORM_ID)).toBeTruthy();
    expect(screen.getByTestId('substitution-manager')).toBeInTheDocument();
    expect(screen.getByTestId('audience-picker')).toBeInTheDocument();
  });

  it('hides audience picker in read-only view mode', () => {
    render(<AddItemFormTemplate {...baseProps} readOnly substitutionEditor={null} />);

    expect(screen.queryByTestId('audience-picker')).not.toBeInTheDocument();
    expect(screen.queryByTestId('substitution-manager')).not.toBeInTheDocument();
  });
});
