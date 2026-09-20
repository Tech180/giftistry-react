import type { UserListItem } from './user-list-item.interface';

export interface UserListResponse {
  Users: UserListItem[];
  Page: number;
  Total: number;
}
