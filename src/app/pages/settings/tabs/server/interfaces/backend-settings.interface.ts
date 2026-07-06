export interface BackendSettings {
  dbType: 'local' | 'remote';
  dbUrl: string;
  smtpType: 'local' | 'remote';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  smtpFrom: string;
  aiEnabled?: boolean;
  aiProvider?: 'gemini' | 'openai' | 'anthropic' | 'local' | 'openrouter';
  aiApiKey?: string;
  aiModel?: string;
  aiPrompt?: string;
  aiEndpoint?: string;
}
