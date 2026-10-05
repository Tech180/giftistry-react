import type { ListFilterCapabilities } from '../interfaces/list-filter-capabilities.interface';
import type { ListFilterContext } from '../interfaces/list-filter-context.interface';

export function resolveListFilterCapabilities(context: ListFilterContext): ListFilterCapabilities {
  const canManage = context.isOwner || context.canCollaborate;
  const isViewer = !canManage && !context.isPublicGuest;

  return {
    showAvailabilityFilter: isViewer,
    showSuggestionsType: isViewer && context.revealSuggestions,
    showAddedBy: !context.isPublicGuest,
    showGroupFunding: context.allowGroupFunds,
    showFavorites: true,
    showPriorityOnly: true,
    showPricePresence: false,
    showPartialQuantity: isViewer,
    showEnrichFilters: true,
    allowCustomPresets: canManage && !context.isPublicGuest,
  };
}
