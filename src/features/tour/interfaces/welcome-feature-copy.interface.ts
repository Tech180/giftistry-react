export type WelcomeFeatureIconId = 'gift' | 'list-plus' | 'users';

export interface WelcomeFeatureCopy {
  title: string;
  description: string;
  icon: WelcomeFeatureIconId;
}
