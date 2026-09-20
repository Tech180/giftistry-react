export interface Props {
  active: boolean;
  grabSwitchId: string;
  optimizeSwitchId: string;
  grabArmed: boolean;
  optimizeArmed: boolean;
  canOptimizeCategories: boolean;
  disabled?: boolean;
  onGrabChange: (checked: boolean) => void;
  onOptimizeChange: (checked: boolean) => void;
}
