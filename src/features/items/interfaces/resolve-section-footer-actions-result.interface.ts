import type { SectionFooterSubstitutionSurface } from './section-footer-substitution-surface.interface';

export interface ResolveSectionFooterActionsResult {
  /** Parent Edit/Delete when the viewer can edit the parent item. */
  showParentEditDelete: boolean;
  /** Section-gated Add / Edit-Delete substitution controls; null when hidden. */
  substitutionSurface: SectionFooterSubstitutionSurface | null;
}
