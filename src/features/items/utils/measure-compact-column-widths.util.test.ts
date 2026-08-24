import { describe, expect, it } from 'vitest';
import {
  measureCompactColumnWidths,
  toCompactColumnWidthCssVars,
} from './measure-compact-column-widths.util';

describe('measureCompactColumnWidths', () => {
  it('takes the max offsetWidth per column key', () => {
    const container = document.createElement('div');
    const a = document.createElement('div');
    a.setAttribute('data-compact-col', 'leading');
    Object.defineProperty(a, 'offsetWidth', { value: 24 });
    const b = document.createElement('div');
    b.setAttribute('data-compact-col', 'leading');
    Object.defineProperty(b, 'offsetWidth', { value: 40 });
    const c = document.createElement('div');
    c.setAttribute('data-compact-col', 'price');
    Object.defineProperty(c, 'offsetWidth', { value: 56 });
    container.append(a, b, c);

    expect(measureCompactColumnWidths(container)).toEqual(
      expect.objectContaining({
        leading: 40,
        price: 56,
        relations: 0,
      })
    );
  });
});

describe('toCompactColumnWidthCssVars', () => {
  it('emits px for active measured columns and 0px for inactive ones', () => {
    expect(
      toCompactColumnWidthCssVars(
        { leading: 32, price: 48, relations: 20 },
        ['leading', 'price']
      )
    ).toEqual(
      expect.objectContaining({
        '--compact-col-leading': '32px',
        '--compact-col-price': '48px',
        '--compact-col-relations': '0px',
      })
    );
  });

  it('uses auto when an active column has zero measured width', () => {
    expect(
      toCompactColumnWidthCssVars({ leading: 0 }, ['leading'])['--compact-col-leading']
    ).toBe('auto');
  });
});
