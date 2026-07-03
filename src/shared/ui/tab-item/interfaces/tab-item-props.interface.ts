export interface TabItemProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}
