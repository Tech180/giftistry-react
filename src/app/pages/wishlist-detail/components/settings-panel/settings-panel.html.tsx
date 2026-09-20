import React from 'react';
import { Switch } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import type { SettingsRowView } from './interfaces/settings-row-view.interface';
import styles from './settings-panel.module.css';

const SettingsRow: React.FC<Omit<SettingsRowView, 'key'>> = ({
  label,
  checked,
  readOnly,
  icon,
  iconClassName,
  rowClassName,
  metaClassName,
  meta,
  ariaLabel,
  switchAriaLabel,
  onToggle,
}) => {
  const body = (
    <>
      <span
        className = {
          iconClassName
        }
        aria-hidden = {
          true
        }
      >
        {icon}
      </span>
      <span
        className = {
          styles['settings-panel__row-text']
        }
      >
        <span
          className = {
            styles['settings-panel__row-label']
          }
        >
          {label}
        </span>
        <span
          className = {
            metaClassName
          }
        >
          {meta}
        </span>
      </span>
      <span
        className = {
          styles['settings-panel__switch-slot']
        }
        onClick = {
          readOnly ? undefined : (event) => event.stopPropagation()
        }
        onKeyDown = {
          readOnly ? undefined : (event) => event.stopPropagation()
        }
      >
        <Switch
          size = {
            'sm'
          }
          checked = {
            checked
          }
          disabled = {
            readOnly
          }
          onChange = {
            readOnly ? () => undefined : () => onToggle()
          }
          aria-label = {
            switchAriaLabel
          }
        />
      </span>
    </>
  );

  if (readOnly) {
    return (
      <div
        className = {
          rowClassName
        }
        aria-disabled = {
          'true'
        }
        aria-label = {
          ariaLabel
        }
      >
        {body}
      </div>
    );
  }

  return (
    <button
      type = {
        'button'
      }
      className = {
        rowClassName
      }
      onClick = {
        onToggle
      }
      aria-pressed = {
        checked
      }
      aria-label = {
        ariaLabel
      }
    >
      {body}
    </button>
  );
};

export const SettingsPanelTemplate: React.FC<TemplateProps> = ({
  rootClassName,
  panelAriaLabel,
  rows,
}) => {
  return (
    <div
      className = {
        rootClassName
      }
      role = {
        'group'
      }
      aria-label = {
        panelAriaLabel
      }
    >
      {rows.map(({ key, ...row }) => (
        <SettingsRow
          key = {
            key
          }
          {...row}
        />
      ))}
    </div>
  );
};
