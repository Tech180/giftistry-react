import { META_OFF, META_ON } from '../constants/copy.constant';
import type { RowCopy } from '../interfaces/row-copy.interface';

export function getRowMeta(checked: boolean): string {
  return checked ? META_ON : META_OFF;
}

export function getRowAriaLabel(readOnly: boolean, checked: boolean, copy: RowCopy): string {
  if (readOnly) {
    return checked ? copy.viewOn : copy.viewOff;
  }

  return checked ? copy.editDisable : copy.editEnable;
}

export function getSwitchAriaLabel(checked: boolean, copy: RowCopy): string {
  return checked ? copy.switchDisable : copy.switchEnable;
}
