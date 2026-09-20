export interface SidebarTemplateProps {
  isAdmin: boolean;
  isOwner: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  panelId: string;
  onToggleCollapsed: () => void;
}
