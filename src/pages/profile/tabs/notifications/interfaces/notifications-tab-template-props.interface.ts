export interface NotificationsTabTemplateProps {
  emailAlerts: boolean;
  marketingPromos: boolean;
  handleToggleEmail: (checked: boolean) => void;
  handleToggleMarketing: (checked: boolean) => void;
}
export default NotificationsTabTemplateProps;
