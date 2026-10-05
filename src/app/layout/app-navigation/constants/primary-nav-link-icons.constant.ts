import { LayoutGrid, Users, type LucideIcon } from 'lucide-react';
import type { PrimaryNavLinkId } from './primary-nav-links.constant';

export const PRIMARY_NAV_LINK_ICONS: Record<PrimaryNavLinkId, LucideIcon> = {
  dashboard: LayoutGrid,
  friends: Users,
};
