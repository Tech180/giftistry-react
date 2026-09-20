export interface DashboardHeaderTemplateProps {
  greeting: string;
  isImportOpen: boolean;
  canShowAi: boolean;
  onToggleImport: () => void;
  onOpenCreate: () => void;
}
