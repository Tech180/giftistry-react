export interface AiSectionProps {
  aiEnabled: boolean;
  setAiEnabled: (value: boolean) => void;
  aiProvider: 'gemini' | 'openai' | 'anthropic' | 'local' | 'openrouter';
  setAiProvider: (value: 'gemini' | 'openai' | 'anthropic' | 'local' | 'openrouter') => void;
  aiApiKey: string;
  setAiApiKey: (value: string) => void;
  aiModel: string;
  setAiModel: (value: string) => void;
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  aiEndpoint: string;
  setAiEndpoint: (value: string) => void;
  showAiKey: boolean;
  setShowAiKey: (value: boolean) => void;
  openrouterModels: Array<{ id: string; name: string; company: string; displayName: string }>;
  isLoadingModels: boolean;
  companies: string[];
  selectedCompany: string;
  setSelectedCompany: (value: string) => void;
  filteredModels: Array<{ id: string; name: string; company: string; displayName: string }>;
}
