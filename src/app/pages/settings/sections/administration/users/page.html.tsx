import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Plus } from 'lucide-react';
import { EnterPanel, Button, Modal, Switch } from 'shared/ui';
import { PaginationControls, SearchInput } from '../components';
import type { TemplateProps } from './interfaces/template-props.interface';
import shared from '../shared.module.css';
import styles from './page.module.css';

export const PageTemplate: React.FC<TemplateProps> = ({
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
}) => (
  <EnterPanel animation="fade" className={shared['admin__pane']}>
    <div className={shared['admin__page-header']}>
      <h1 className={shared['admin__page-title']}>Users</h1>
      <p className={shared['admin__page-subtitle']}>Manage accounts, roles, and access.</p>
    </div>

    <div className={shared['admin__toolbar']}>
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search users by name or email..."
      />
      <Button variant="secondary" onClick={onOpenCreate} leftIcon={<Plus size={14} />}>
        New User
      </Button>
    </div>

    {isLoading ? (
      <p className={shared['admin__empty']}>Loading users...</p>
    ) : rows.length === 0 ? (
      <p className={shared['admin__empty']}>No users found.</p>
    ) : (
      <div className={shared['admin__table-wrap']}>
        <table className={shared['admin__table']}>
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
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.usernameLabel}</td>
                <td className={shared['admin__text-muted']}>{row.emailLabel}</td>
                <td>
                  <span className={row.roleClassName}>{row.roleLabel}</span>
                </td>
                <td>
                  <span className={row.statusClassName}>{row.statusLabel}</span>
                </td>
                <td>{row.activeListsLabel}</td>
                <td className={shared['admin__text-muted']}>{row.lastLoginLabel}</td>
                <td className={shared['admin__text-muted']}>{row.lastOnlineLabel}</td>
                <td className={styles['page__cell--end']}>
                  <Link to={row.manageHref}>
                    <Button variant="secondary" size="sm">
                      {row.manageLabel}
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {showPagination && (
      <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
    )}

    <Modal isOpen={showCreate} onClose={onCloseCreate} title="Create new user">
      <form onSubmit={onCreateSubmit} className={styles['page__modal-form']}>
        <div className={`${shared['admin__form-field']} ${styles['page__form-field--modal']}`}>
          <label>Username *</label>
          <input
            className={shared['admin__form-input']}
            required
            value={createForm.username}
            onChange={(e) => onCreateFormChange({ username: e.target.value })}
          />
        </div>
        <div className={`${shared['admin__form-field']} ${styles['page__form-field--modal']}`}>
          <label>Email address</label>
          <input
            className={shared['admin__form-input']}
            type="email"
            value={createForm.email}
            onChange={(e) => onCreateFormChange({ email: e.target.value })}
          />
        </div>
        <div className={`${shared['admin__form-row']} ${styles['page__form-row--modal']}`}>
          <div
            className={`${shared['admin__form-field']} ${shared['admin__form-field--inline']} ${styles['page__form-field--modal']}`}
          >
            <label>First name *</label>
            <input
              className={shared['admin__form-input']}
              required
              value={createForm.firstName}
              onChange={(e) => onCreateFormChange({ firstName: e.target.value })}
            />
          </div>
          <div
            className={`${shared['admin__form-field']} ${shared['admin__form-field--inline']} ${styles['page__form-field--modal']}`}
          >
            <label>Last name *</label>
            <input
              className={shared['admin__form-input']}
              required
              value={createForm.lastName}
              onChange={(e) => onCreateFormChange({ lastName: e.target.value })}
            />
          </div>
        </div>
        <div className={`${shared['admin__form-field']} ${styles['page__form-field--modal']}`}>
          <label>Temporary password *</label>
          <div className={styles['page__password']}>
            <input
              className={`${shared['admin__form-input']} ${styles['page__password-input']}`}
              required
              type={showCreatePassword ? 'text' : 'password'}
              minLength={6}
              value={createForm.password}
              onChange={(e) => onCreateFormChange({ password: e.target.value })}
            />
            <button
              type="button"
              className={styles['page__password-toggle']}
              onClick={onToggleCreatePassword}
              aria-label={showCreatePassword ? 'Hide password' : 'Show password'}
            >
              {showCreatePassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <div className={styles['page__modal-divider']}>
          <div className={`${styles['page__modal-switch-row']} ${styles['page__modal-switch-row--spaced']}`}>
            <span className={styles['page__modal-switch-label']}>Require password change</span>
            <Switch
              checked={createForm.forcePasswordChange}
              onChange={(checked) => onCreateFormChange({ forcePasswordChange: checked })}
              aria-label="Require password change on first login"
            />
          </div>
          <div className={styles['page__modal-switch-row']}>
            <span className={styles['page__modal-switch-label']}>Grant administrator</span>
            <Switch
              checked={createForm.isAdmin}
              onChange={(checked) => onCreateFormChange({ isAdmin: checked })}
              aria-label="Grant administrator"
            />
          </div>
        </div>
        <div className={styles['page__modal-actions']}>
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
