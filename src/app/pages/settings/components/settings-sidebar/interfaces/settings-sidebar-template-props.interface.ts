export interface SettingsSidebarTemplateProps {
  isAdmin: boolean;
  isOwner: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  panelId: string;
  onToggleCollapsed: () => void;
}
