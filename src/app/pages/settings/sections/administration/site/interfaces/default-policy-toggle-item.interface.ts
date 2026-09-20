export interface DefaultPolicyToggleItem {
  key: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
