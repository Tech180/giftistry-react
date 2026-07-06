export interface SettingsSidebarTemplateProps {
  isAdmin: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
}
