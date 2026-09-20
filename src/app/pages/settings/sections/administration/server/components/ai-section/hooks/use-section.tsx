import { useState } from 'react';
import type { AiModelSlot } from 'features/system';
import { MODEL_HELPER } from '../constants/model-helper.constant';
import type { AiSectionProps } from '../interfaces/props.interface';
import type { AiSectionTemplateProps } from '../interfaces/template-props.interface';

export function useSection(props: AiSectionProps): AiSectionTemplateProps {
  const {
    aiFastProvider,
    setAiFastProvider,
    aiFastEndpoint,
    setAiFastEndpoint,
    aiFastApiKey,
    setAiFastApiKey,
    aiFastModel,
    setAiFastModel,
    aiIntelligentProvider,
    setAiIntelligentProvider,
    aiIntelligentEndpoint,
    setAiIntelligentEndpoint,
    aiIntelligentApiKey,
    setAiIntelligentApiKey,
    aiIntelligentModel,
    setAiIntelligentModel,
    showFastAiKey,
    setShowFastAiKey,
    showIntelligentAiKey,
    setShowIntelligentAiKey,
    selectedFastCompany,
    setSelectedFastCompany,
    selectedIntelligentCompany,
    setSelectedIntelligentCompany,
    filteredFastModels,
    filteredIntelligentModels,
    localFastModels,
    localIntelligentModels,
    localFastModelMode,
    localIntelligentModelMode,
    fastConnectionStatus,
    fastConnectionMessage,
    intelligentConnectionStatus,
    intelligentConnectionMessage,
    ...passthrough
  } = props;

  const [connectionSlot, setConnectionSlot] = useState<AiModelSlot>('fast');
  const isFastSlot = connectionSlot === 'fast';
  const activeProvider = isFastSlot ? aiFastProvider : aiIntelligentProvider;
  const setActiveProvider = isFastSlot ? setAiFastProvider : setAiIntelligentProvider;
  const activeEndpoint = isFastSlot ? aiFastEndpoint : aiIntelligentEndpoint;
  const setActiveEndpoint = isFastSlot ? setAiFastEndpoint : setAiIntelligentEndpoint;
  const activeApiKey = isFastSlot ? aiFastApiKey : aiIntelligentApiKey;
  const setActiveApiKey = isFastSlot ? setAiFastApiKey : setAiIntelligentApiKey;
  const showActiveAiKey = isFastSlot ? showFastAiKey : showIntelligentAiKey;
  const setShowActiveAiKey = isFastSlot ? setShowFastAiKey : setShowIntelligentAiKey;
  const activeConnectionStatus = isFastSlot ? fastConnectionStatus : intelligentConnectionStatus;
  const activeConnectionMessage = isFastSlot ? fastConnectionMessage : intelligentConnectionMessage;
  const isTestingAiConnection = activeConnectionStatus === 'checking';
  const localModelSelectDisabled = isTestingAiConnection;
  const activeLocalModels = isFastSlot ? localFastModels : localIntelligentModels;
  const showModelPicker =
    activeProvider === 'local'
      ? activeEndpoint.trim().length > 0 &&
        (activeConnectionStatus === 'success' || activeLocalModels.length > 0)
      : activeApiKey.trim().length > 0;
  const activeModel = isFastSlot ? aiFastModel : aiIntelligentModel;
  const setActiveModel = isFastSlot ? setAiFastModel : setAiIntelligentModel;
  const activeSelectedCompany = isFastSlot ? selectedFastCompany : selectedIntelligentCompany;
  const setActiveSelectedCompany = isFastSlot ? setSelectedFastCompany : setSelectedIntelligentCompany;
  const activeFilteredModels = isFastSlot ? filteredFastModels : filteredIntelligentModels;
  const activeLocalModelMode = isFastSlot ? localFastModelMode : localIntelligentModelMode;
  const modelHelper = isFastSlot ? MODEL_HELPER.fast : MODEL_HELPER.intelligent;

  return {
    ...passthrough,
    connectionSlot,
    setConnectionSlot,
    isFastSlot,
    activeProvider,
    setActiveProvider,
    activeEndpoint,
    setActiveEndpoint,
    activeApiKey,
    setActiveApiKey,
    showActiveAiKey,
    setShowActiveAiKey,
    activeConnectionStatus,
    activeConnectionMessage,
    isTestingAiConnection,
    localModelSelectDisabled,
    activeLocalModels,
    showModelPicker,
    activeModel,
    setActiveModel,
    activeSelectedCompany,
    setActiveSelectedCompany,
    activeFilteredModels,
    activeLocalModelMode,
    modelHelper,
  };
}
