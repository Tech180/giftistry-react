export interface ListFilterCapabilities {
  /** Open / claimed filter — gifters and viewers, not list managers. */
  showAvailabilityFilter: boolean;
  showSuggestionsType: boolean;
  showAddedBy: boolean;
  showGroupFunding: boolean;
  showFavorites: boolean;
  showPriorityOnly: boolean;
  showPricePresence: boolean;
  showPartialQuantity: boolean;
  showEnrichFilters: boolean;
  allowCustomPresets: boolean;
}
