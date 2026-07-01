export interface VerificationBannerTemplateProps {
  onResend: () => Promise<void>;
  isLoading: boolean;
  cooldown: number;
}
export default VerificationBannerTemplateProps;
