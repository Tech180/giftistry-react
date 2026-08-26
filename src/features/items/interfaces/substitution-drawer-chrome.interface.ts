export interface SubstitutionDrawerChrome {
  mode: 'create' | 'edit';
  isSaving: boolean;
  canSubmit: boolean;
  /**
   * True when opened from the parent item edit surface (Back returns to parent).
   * False when opened directly from card/footer auto-open (Close dismisses drawer).
   */
  nestedBack: boolean;
}
