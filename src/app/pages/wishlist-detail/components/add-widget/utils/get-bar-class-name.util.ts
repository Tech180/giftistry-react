import styles from '../add-widget.module.css';

export function getBarClassName(
  isInputMode: boolean,
  isExpanded: boolean,
  canAutoAdd: boolean
): string {
  return [
    styles['add-widget__bar'],
    isInputMode ? styles['add-widget__bar--input-mode'] : '',
    isExpanded ? styles['add-widget__bar--menu-open'] : '',
    isExpanded && !canAutoAdd ? styles['add-widget__bar--menu-open-compact'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
