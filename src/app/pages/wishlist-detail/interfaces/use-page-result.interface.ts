import type { PageTemplateProps } from './page-template-props.interface';
import type { UsePageActionsOptions } from './use-page-actions-options.interface';

export interface UsePageResult extends PageTemplateProps {
  mobileActions: UsePageActionsOptions;
}
