import type { SettingsRowView } from './settings-row-view.interface';

export interface TemplateProps {
  rootClassName: string;
  panelAriaLabel: string;
  rows: SettingsRowView[];
}
