export interface ClaimFormQuantityRow {
  selection: string | null;
  name: string;
  inputId: string;
  quantity: number;
  maxForUser: number;
  remaining: number;
  outOfStock: boolean;
  rowClassName: string;
  hintClassName: string;
  decreaseLabel: string;
  increaseLabel: string;
  selectorDisabled: boolean;
}
