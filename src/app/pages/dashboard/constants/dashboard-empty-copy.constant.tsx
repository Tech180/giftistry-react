import { Archive, Sparkles, Users, type LucideIcon } from 'lucide-react';
import type { DashboardTabId } from '../interfaces/dashboard-tab-id.type';

export const DASHBOARD_EMPTY_COPY: Record<
  DashboardTabId,
  { title: string; description: string; Icon: LucideIcon }
> = {
  'my-lists': {
    title: 'No active wishlists yet',
    description: 'Create your first registry to start adding items and sharing with friends.',
    Icon: Sparkles,
  },
  shared: {
    title: 'No shared lists right now',
    description: 'When friends share their wishlists with you, they will appear here.',
    Icon: Users,
  },
  archive: {
    title: 'Your archive is empty',
    description: 'Expired registry lists will automatically move here.',
    Icon: Archive,
  },
};
