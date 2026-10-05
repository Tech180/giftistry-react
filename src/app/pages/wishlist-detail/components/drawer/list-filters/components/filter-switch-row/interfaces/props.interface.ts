export interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
