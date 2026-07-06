import styles from 'app/pages/dashboard/dashboard.module.css';

describe('CSS module exports (localsConvention: dashes)', () => {
  test('single-word classes resolve via dot notation', () => {
    expect(styles.container).toBeTruthy();
    expect(styles.header).toBeTruthy();
  });

  test('dashed classes resolve via bracket notation', () => {
    expect(styles['error-banner']).toBeTruthy();
    expect(styles['controls-row']).toBeTruthy();
    expect(styles['search-input']).toBeTruthy();
  });

  test('dashed classes also resolve via camelCase alias', () => {
    expect(styles.errorBanner).toBeTruthy();
    expect(styles.controlsRow).toBeTruthy();
    expect(styles.searchInput).toBeTruthy();
  });
});
