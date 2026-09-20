import {
  DRAWER_TITLE_ADD,
  DRAWER_TITLE_ADD_SUBSTITUTION,
  DRAWER_TITLE_EDIT,
  DRAWER_TITLE_EDIT_SUBSTITUTION,
  DRAWER_TITLE_VIEW,
} from '../constants/drawer-titles.constant';
import type { GetDrawerTitleInput } from '../interfaces/get-drawer-title-input.interface';

export function getDrawerTitle(input: GetDrawerTitleInput): string {
  if (input.isSubstitutionMode) {
    return input.substitutionMode === 'edit' ? DRAWER_TITLE_EDIT_SUBSTITUTION : DRAWER_TITLE_ADD_SUBSTITUTION;
  }

  if (input.isView) {
    return DRAWER_TITLE_VIEW;
  }

  if (input.isEdit) {
    return DRAWER_TITLE_EDIT;
  }

  return DRAWER_TITLE_ADD;
}
