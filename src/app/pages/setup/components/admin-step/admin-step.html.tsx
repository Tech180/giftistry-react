import React from 'react';
import { AtSign, Info, Eye, EyeOff } from 'lucide-react';
import styles from './admin-step.module.css';
import type { AdminStepTemplateProps } from './interfaces/template-props.interface';

export const AdminStepTemplate: React.FC<AdminStepTemplateProps> = ({
  adminUsername,
  adminPassword,
  adminConfirmPassword,
  adminFirstName,
  adminLastName,
  showPassword,
  showConfirmPassword,
  errors,
  onFieldChange,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
}) => (
  <div className={`${styles['admin-step']} ${styles['admin-step--active']}`}>
    <header className={styles['admin-step__header']}>
      <h2 className={styles['admin-step__heading']}>Create Administrator</h2>
      <p className={styles['admin-step__subheading']}>
        Set up the initial primary account. This user will have full administrative privileges over
        the instance.
      </p>
    </header>

    {errors.setup && <p className={styles['admin-step__setup-error']}>{errors.setup}</p>}

    <div className={styles['admin-step__form-stack']}>
      <div className={styles['admin-step__form-grid']}>
        <div>
          <label htmlFor="adminFirstName" className={styles['admin-step__label']}>
            First Name
          </label>
          <input
            id="adminFirstName"
            type="text"
            className={`${styles['admin-step__input']} ${
              errors.adminFirstName ? styles['admin-step__input--error'] : ''
            }`}
            value={adminFirstName}
            onChange={(e) => onFieldChange('adminFirstName', e.target.value)}
            autoComplete="given-name"
          />
          {errors.adminFirstName && (
            <p className={styles['admin-step__field-error']}>{errors.adminFirstName}</p>
          )}
        </div>
        <div>
          <label htmlFor="adminLastName" className={styles['admin-step__label']}>
            Last Name
          </label>
          <input
            id="adminLastName"
            type="text"
            className={`${styles['admin-step__input']} ${
              errors.adminLastName ? styles['admin-step__input--error'] : ''
            }`}
            value={adminLastName}
            onChange={(e) => onFieldChange('adminLastName', e.target.value)}
            autoComplete="family-name"
          />
          {errors.adminLastName && (
            <p className={styles['admin-step__field-error']}>{errors.adminLastName}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="adminUsername" className={styles['admin-step__label']}>
          Username
        </label>
        <div className={styles['admin-step__input-with-icon']}>
          <AtSign size={16} className={styles['admin-step__input-icon']} aria-hidden />
          <input
            id="adminUsername"
            type="text"
            className={`${styles['admin-step__input']} ${styles['admin-step__input--padded']} ${
              errors.adminUsername ? styles['admin-step__input--error'] : ''
            }`}
            placeholder="admin"
            value={adminUsername}
            onChange={(e) => onFieldChange('adminUsername', e.target.value)}
            autoComplete="username"
          />
        </div>
        {errors.adminUsername && (
          <p className={styles['admin-step__field-error']}>{errors.adminUsername}</p>
        )}
      </div>

      <div className={styles['admin-step__form-grid']}>
        <div>
          <label htmlFor="adminPassword" className={styles['admin-step__label']}>
            Password
          </label>
          <div className={styles['admin-step__input-with-toggle']}>
            <input
              id="adminPassword"
              type={showPassword ? 'text' : 'password'}
              className={`${styles['admin-step__input']} ${styles['admin-step__input--toggle-padded']} ${
                errors.adminPassword ? styles['admin-step__input--error'] : ''
              }`}
              placeholder="••••••••"
              value={adminPassword}
              onChange={(e) => onFieldChange('adminPassword', e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles['admin-step__password-toggle']}
              onClick={onToggleShowPassword}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.adminPassword && (
            <p className={styles['admin-step__field-error']}>{errors.adminPassword}</p>
          )}
        </div>
        <div>
          <label htmlFor="adminConfirmPassword" className={styles['admin-step__label']}>
            Confirm Password
          </label>
          <div className={styles['admin-step__input-with-toggle']}>
            <input
              id="adminConfirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`${styles['admin-step__input']} ${styles['admin-step__input--toggle-padded']} ${
                errors.adminConfirmPassword ? styles['admin-step__input--error'] : ''
              }`}
              placeholder="••••••••"
              value={adminConfirmPassword}
              onChange={(e) => onFieldChange('adminConfirmPassword', e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles['admin-step__password-toggle']}
              onClick={onToggleShowConfirmPassword}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.adminConfirmPassword && (
            <p className={styles['admin-step__field-error']}>{errors.adminConfirmPassword}</p>
          )}
        </div>
      </div>

      <div className={styles['admin-step__callout']}>
        <Info size={16} className={styles['admin-step__callout-icon']} aria-hidden />
        <p className={styles['admin-step__callout-text']}>
          Password must be at least 8 characters and include a combination of letters and numbers.
        </p>
      </div>
    </div>
  </div>
);
