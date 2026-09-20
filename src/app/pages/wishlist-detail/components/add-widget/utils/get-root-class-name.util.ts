import styles from '../add-widget.module.css';

export function getRootClassName(isInputMode: boolean, canAutoAdd: boolean): string {
  return [
    styles['add-widget'],
    isInputMode ? styles['add-widget--input-mode'] : '',
    canAutoAdd ? styles['add-widget--auto-add'] : '',
  ]
    .filter(Boolean)
    .join(' ');
}
