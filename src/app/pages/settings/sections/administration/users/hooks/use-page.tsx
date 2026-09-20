import { useAuth } from 'features/auth';
import { useUsers } from 'features/admin';
import { formatDateTime } from 'shared/utils/format-date.util';
import type { SectionProps } from '../../interfaces/section-props.interface';
import { STATUS_CLASS } from '../constants/status-class.constant';
import type { TemplateProps } from '../interfaces/template-props.interface';
import type { UserRow } from '../interfaces/user-row.interface';
import { getRole } from '../utils/get-role.util';
import { getUserStatus } from '../utils/get-user-status.util';

export function usePage({ showToast }: SectionProps): TemplateProps {
  const { user: currentUser } = useAuth();
  const {
    users,
    search,
    page,
    totalPages,
    showPagination,
    isLoading,
    showCreate,
    createForm,
    showCreatePassword,
    currentUserIsOwner,
    onSearchChange,
    onOpenCreate,
    onCloseCreate,
    onCreateFormChange,
    onToggleCreatePassword,
    onCreateSubmit,
    onPageChange,
  } = useUsers({ showToast, currentUser });

  const rows: UserRow[] = users.map((user) => {
    const status = getUserStatus(user);
    const role = getRole(user);
    return {
      id: user.Id,
      usernameLabel: `@${user.Username}`,
      emailLabel: user.Email ?? '',
      roleLabel: role.label,
      roleClassName: role.className,
      statusLabel: status.label,
      statusClassName: STATUS_CLASS[status.tone],
      activeListsLabel: user.ActiveListsCount ?? 0,
      lastLoginLabel: formatDateTime(user.LastLoginAt),
      lastOnlineLabel: formatDateTime(user.LastOnline),
      manageHref: `/settings/admin/users/${user.Id}`,
      manageLabel: user.IsOwner && !currentUserIsOwner ? 'View' : 'Manage',
    };
  });

  return {
    rows,
    search,
    page,
    totalPages,
    showPagination,
    isLoading,
    showCreate,
    createForm,
    showCreatePassword,
    onSearchChange,
    onOpenCreate,
    onCloseCreate,
    onCreateFormChange,
    onToggleCreatePassword,
    onCreateSubmit,
    onPageChange,
  };
}
