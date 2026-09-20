import { useSystemSettingsController } from 'features/system';
import type { ServerProps } from '../interfaces/props.interface';
import type { ServerTemplateProps } from '../interfaces/template-props.interface';

export function usePage(props: ServerProps): ServerTemplateProps {
  return useSystemSettingsController(props);
}
