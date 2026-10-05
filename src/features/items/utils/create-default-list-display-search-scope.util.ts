import type { ListDisplaySearchScope } from '../interfaces/list-display-search-scope.interface';

export function createDefaultListDisplaySearchScope(): ListDisplaySearchScope {
  return {
    name: true,
    description: true,
    category: true,
    retailer: true,
  };
}
