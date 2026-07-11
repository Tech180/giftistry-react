import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { EnterPanel, Button, Modal, Switch } from 'shared/ui';
import type { AdminUser } from 'features/admin';
import { AdminSearchInput } from '../components/admin-search-input';
import { AdminUsersTabTemplateProps } from './interfaces/admin-users-tab-template-props.interface';
import styles from '../admin.shared.module.css';

const statusBadge = (user: AdminUser) => {
  if (user.IsDisabled) return <span className={`${styles.badge} ${styles['badge-disabled']}`}>Disabled</span>;
  if (user.LockedUntil && new Date(user.LockedUntil) > new Date()) {
    return <span className={`${styles.badge} ${styles['badge-locked']}`}>Locked</span>;
  }
  return <span className={`${styles.badge} ${styles['badge-active']}`}>Active</span>;
};

export const AdminUsersTabTemplate: React.FC<AdminUsersTabTemplateProps> = ({
  users,
  search,
  page,
  total,
  isLoading,
  showCreate,
  createForm,
  onSearchChange,
  onOpenCreate,
  onCloseCreate,
  onCreateFormChange,
  onCreateSubmit,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / 25);

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Users</h1>
        <p className={styles['page-subtitle']}>Manage accounts, roles, and access.</p>
      </div>

      <div className={styles.toolbar}>
        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search users by name or email..."
        />
        <Button variant="secondary" onClick={onOpenCreate} leftIcon={<Plus size={14} />}>
          New User
        </Button>
      </div>

      {isLoading ? (
        <p className={styles.empty}>Loading users...</p>
      ) : users.length === 0 ? (
        <p className={styles.empty}>No users found.</p>
      ) : (
        <div className={styles['table-wrap']}>
          <table className={styles['linear-table']}>
             <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Account Type</th>
                <th>Status</th>
                <th>Lists</th>
                <th>Last login</th>
                <th>Last online</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.Id}>
                  <td>@{user.Username}</td>
                  <td className={styles['text-muted']}>{user.Email}</td>
                  <td>
                    {user.IsOwner ? (
                      <span className={`${styles.badge} ${styles['badge-owner']}`}>
                        Owner
                      </span>
                    ) : user.IsAdmin ? (
                      <span className={`${styles.badge} ${styles['badge-admin']}`}>
                        Admin
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles['badge-user']}`}>
                        User
                      </span>
                    )}
                  </td>
                  <td>{statusBadge(user)}</td>
                  <td>{user.ActiveListsCount ?? 0}</td>
                  <td className={styles['text-muted']}>
                    {user.LastLoginAt ? new Date(user.LastLoginAt).toLocaleString() : '—'}
                  </td>
                  <td className={styles['text-muted']}>
                    {user.LastOnline ? new Date(user.LastOnline).toLocaleString() : '—'}
                  </td>
                  <td className={styles['text-right']}>
                    <Link to={`/settings/admin/users/${user.Id}`}>
                      <Button variant="secondary" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 25 && (
        <div className={styles['actions-row']}>
          <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <span className={styles['pagination-label']}>
            Page {page} of {totalPages}
          </span>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={onCloseCreate} title="Create new user">
        <form onSubmit={onCreateSubmit} className={styles['modal-form']}>
          <div className={styles['form-field']}>
            <label>Username</label>
            <input
              className={styles['form-input']}
              required
              value={createForm.username}
              onChange={(e) => onCreateFormChange({ username: e.target.value })}
            />
          </div>
          <div className={styles['form-field']}>
            <label>Email address</label>
            <input
              className={styles['form-input']}
              required
              type="email"
              value={createForm.email}
              onChange={(e) => onCreateFormChange({ email: e.target.value })}
            />
          </div>
          <div className={styles['form-row-inline']}>
            <div className={styles['form-field']}>
              <label>First name</label>
              <input
                className={styles['form-input']}
                value={createForm.firstName}
                onChange={(e) => onCreateFormChange({ firstName: e.target.value })}
              />
            </div>
            <div className={styles['form-field']}>
              <label>Last name</label>
              <input
                className={styles['form-input']}
                value={createForm.lastName}
                onChange={(e) => onCreateFormChange({ lastName: e.target.value })}
              />
            </div>
          </div>
          <div className={styles['form-field']}>
            <label>Temporary password</label>
            <input
              className={styles['form-input']}
              required
              type="password"
              minLength={6}
              value={createForm.password}
              onChange={(e) => onCreateFormChange({ password: e.target.value })}
            />
          </div>
          <div className={styles['modal-divider']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Require password change</span>
              <Switch
                checked={createForm.forcePasswordChange}
                onChange={(checked) => onCreateFormChange({ forcePasswordChange: checked })}
                aria-label="Require password change on first login"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Grant administrator</span>
              <Switch
                checked={createForm.isAdmin}
                onChange={(checked) => onCreateFormChange({ isAdmin: checked })}
                aria-label="Grant administrator"
              />
            </div>
          </div>
          <div className={styles['modal-actions']}>
            <Button type="button" variant="secondary" onClick={onCloseCreate}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </EnterPanel>
  );
};
