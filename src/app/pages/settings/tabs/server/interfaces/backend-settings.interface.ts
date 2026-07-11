export interface AiDefaultPromptsView {
  Review: string;
  Description: string;
  Populate: string;
  Category: string;
}

export interface BackendSettings {
  DbType: 'local' | 'remote';
  DbUrl: string;
  SmtpType: 'local' | 'remote';
  SmtpHost: string;
  SmtpPort: number;
  SmtpUser: string;
  SmtpPass: string;
  SmtpSecure: boolean;
  SmtpFrom: string;
  AiEnabled?: boolean;
  AiProvider?: 'gemini' | 'openai' | 'anthropic' | 'local' | 'openrouter';
  AiApiKey?: string;
  AiModel?: string;
  AiPrompt?: string;
  AiDescriptionPrompt?: string;
  AiPopulatePrompt?: string;
  AiCategoryPrompt?: string;
  AiEndpoint?: string;
  AiDefaultPrompts?: AiDefaultPromptsView;
}
