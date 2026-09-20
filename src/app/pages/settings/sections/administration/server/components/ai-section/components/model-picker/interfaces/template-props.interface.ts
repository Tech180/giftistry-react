import type { AiModelSlot } from 'features/system';
import type { LocalAiModelMode } from 'features/system';
import type { SystemModelOption } from 'features/system';
import type { SystemModelsProvider } from 'features/system';

export interface ModelPickerTemplateProps {
  slot: AiModelSlot;
  helper: string;
  model: string;
  setModel: (value: string) => void;
  selectedCompany: string;
  filteredModels: SystemModelOption[];
  localModelMode: LocalAiModelMode;
  slotLocalModels: string[];
  isLocalProvider: boolean;
  aiEnabled: boolean;
  isLoadingModels: boolean;
  companies: string[];
  localModelSelectDisabled: boolean;
  isTestingAiConnection: boolean;
  localModelSelectValue: string;
  customModelValue: string;
  selectId: string;
  inputId: string;
  companyId: string;
  showLocalSelect: boolean;
  showLocalInput: boolean;
  localSelectFullWidth: boolean;
  onCompanyChange: (company: string) => void;
  onLocalModelSelection: (slot: AiModelSlot, value: string) => void;
}
