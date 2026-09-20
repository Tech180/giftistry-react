import type { PageTemplateProps } from './page-template-props.interface';

export interface UsePageResult extends PageTemplateProps {
  redirectTo: string | null;
}
