import React from 'react';
import { LOCAL_AI_CUSTOM_MODEL_VALUE } from 'features/system';
import { isModelInLocalList } from 'features/system';
import type { ModelPickerProps } from './interfaces/props.interface';
import { ModelPickerTemplate } from './model-picker.html';

export const ModelPicker: React.FC<ModelPickerProps> = ({
  slot,
  helper,
  model,
  setModel,
  selectedCompany,
  setSelectedCompany,
  filteredModels,
  localModelMode,
  slotLocalModels,
  provider,
  aiEnabled,
  isLoadingModels,
  companies,
  openrouterModels,
  localModelSelectDisabled,
  isTestingAiConnection,
  onLocalModelSelection,
}) => {
  const selectId = `ai-${slot}-model-select`;
  const inputId = `ai-${slot}-model-input`;
  const companyId = `ai-${slot}-company-select`;
  const isLocalProvider = provider === 'local';
  const localModelSelectValue =
    localModelMode === 'custom'
      ? LOCAL_AI_CUSTOM_MODEL_VALUE
      : isModelInLocalList(model, slotLocalModels)
        ? model
        : '';
  const showLocalSelect = slotLocalModels.length > 0;
  const showLocalInput = slotLocalModels.length === 0 || localModelMode === 'custom';
  const localSelectFullWidth = localModelMode === 'listed';

  const onCompanyChange = (newCompany: string) => {
    setSelectedCompany(newCompany);
    const firstModel = openrouterModels.find((m) => m.company === newCompany);
    if (firstModel) {
      setModel(firstModel.id);
    }
  };

  return (
    <ModelPickerTemplate
      slot = {
        slot
      }
      helper = {
        helper
      }
      model = {
        model
      }
      setModel = {
        setModel
      }
      selectedCompany = {
        selectedCompany
      }
      filteredModels = {
        filteredModels
      }
      localModelMode = {
        localModelMode
      }
      slotLocalModels = {
        slotLocalModels
      }
      isLocalProvider = {
        isLocalProvider
      }
      aiEnabled = {
        aiEnabled
      }
      isLoadingModels = {
        isLoadingModels
      }
      companies = {
        companies
      }
      localModelSelectDisabled = {
        localModelSelectDisabled
      }
      isTestingAiConnection = {
        isTestingAiConnection
      }
      localModelSelectValue = {
        localModelSelectValue
      }
      customModelValue = {
        LOCAL_AI_CUSTOM_MODEL_VALUE
      }
      selectId = {
        selectId
      }
      inputId = {
        inputId
      }
      companyId = {
        companyId
      }
      showLocalSelect = {
        showLocalSelect
      }
      showLocalInput = {
        showLocalInput
      }
      localSelectFullWidth = {
        localSelectFullWidth
      }
      onCompanyChange = {
        onCompanyChange
      }
      onLocalModelSelection = {
        onLocalModelSelection
      }
    />
  );
};

export default ModelPicker;
