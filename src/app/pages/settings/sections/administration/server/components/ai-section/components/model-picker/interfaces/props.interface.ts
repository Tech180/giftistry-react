import type { AiModelSlot } from 'features/system';
import type { LocalAiModelMode } from 'features/system';
import type { SystemModelOption } from 'features/system';
import type { SystemModelsProvider } from 'features/system';

export interface ModelPickerProps {
  slot: AiModelSlot;
  helper: string;
  model: string;
  setModel: (value: string) => void;
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  filteredModels: SystemModelOption[];
  localModelMode: LocalAiModelMode;
  slotLocalModels: string[];
  provider: SystemModelsProvider;
  aiEnabled: boolean;
  isLoadingModels: boolean;
  companies: string[];
  openrouterModels: SystemModelOption[];
  localModelSelectDisabled: boolean;
  isTestingAiConnection: boolean;
  onLocalModelSelection: (slot: AiModelSlot, value: string) => void;
}
