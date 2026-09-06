import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import type { SelectMenuTemplateProps } from './interfaces/select-menu-template-props.interface';
import styles from './select-menu.module.css';

export const SelectMenuTemplate: React.FC<SelectMenuTemplateProps> = ({
  triggerRef,
  menuRef,
  listboxId,
  isOpen,
  disabled,
  triggerClass,
  panelClass,
  panelStyle,
  selectedLabel,
  menuTitle,
  options,
  focusedIndex,
  value,
  ariaLabel,
  id,
  checkIcon,
  chevronSize,
  chevronClass,
  onToggle,
  onSelect,
  onOptionMouseEnter,
}) => {
  const panel =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            className={panelClass}
            style={panelStyle}
            role="listbox"
            aria-label={menuTitle || ariaLabel || 'Options'}
          >
            {menuTitle ? (
              <div className={styles.header}>
                <span className={styles['header-title']}>{menuTitle}</span>
              </div>
            ) : null}
            <div className={styles.items} role="group">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;
                const itemClass = [
                  styles.item,
                  isSelected ? styles['item-selected'] : '',
                  isFocused ? styles['item-focused'] : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled || disabled}
                    className={itemClass}
                    data-value={option.value}
                    onMouseEnter={() => onOptionMouseEnter(index)}
                    onClick={() => onSelect(option.value)}
                  >
                    <span
                      className={[
                        styles['item-icon'],
                        isSelected ? styles['item-icon-selected'] : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden="true"
                    >
                      {isSelected ? checkIcon : option.icon}
                    </span>
                    <span className={styles['item-content']}>
                      <span className={styles['item-label']}>{option.label}</span>
                      {option.description ? (
                        <span className={styles['item-desc']}>{option.description}</span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={triggerClass}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={onToggle}
      >
        <span className={styles['trigger-label']}>{selectedLabel}</span>
        <ChevronDown className={chevronClass} size={chevronSize} aria-hidden />
      </button>
      {panel}
    </>
  );
};
