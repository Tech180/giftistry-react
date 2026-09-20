export interface DashboardHeaderProps {
  greeting: string;
  isImportOpen: boolean;
  canShowAi: boolean;
  onToggleImport: () => void;
  onOpenCreate: () => void;
}
