export interface ProfileSidebarTemplateProps {
  isAdmin: boolean;
  activePath: string;
  onNavigate: (path: string) => void;
}
