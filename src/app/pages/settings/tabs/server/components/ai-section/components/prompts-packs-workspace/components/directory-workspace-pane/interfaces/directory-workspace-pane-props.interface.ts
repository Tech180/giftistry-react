import type { DirectoryPackListItem } from '../../../interfaces/directory-pack-list-item.interface';

export interface DirectoryWorkspacePaneProps {
  items: readonly DirectoryPackListItem[];
  searchQuery: string;
  searchId: string;
  emptyMessage: string;
  isLoading: boolean;
  error: string | null;
  disabled: boolean;
  onSearchChange: (query: string) => void;
  onSelectPack: (packId: string) => void;
  onTogglePack: (packId: string, enabled: boolean) => void;
  onCreatePack: () => void;
}
