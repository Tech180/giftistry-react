import { describe, expect, it, vi } from 'vitest';
import { getTagScrollState, getTagScrollStep, scrollTagsByOne } from './tag-scroll.util';

function createScrollBox(
  partial: Partial<Pick<HTMLElement, 'scrollTop' | 'scrollHeight' | 'clientHeight'>>
): HTMLElement {
  return {
    scrollTop: 0,
    scrollHeight: 100,
    clientHeight: 100,
    ...partial,
  } as HTMLElement;
}

describe('getTagScrollState', () => {
  it('is not scrollable when content fits', () => {
    expect(getTagScrollState(createScrollBox({}))).toEqual({
      canScrollUp: false,
      canScrollDown: false,
    });
  });

  it('can scroll down from the top of overflow content', () => {
    expect(
      getTagScrollState(createScrollBox({ scrollHeight: 200, clientHeight: 100, scrollTop: 0 }))
    ).toEqual({
      canScrollUp: false,
      canScrollDown: true,
    });
  });

  it('can scroll up from the bottom of overflow content', () => {
    expect(
      getTagScrollState(createScrollBox({ scrollHeight: 200, clientHeight: 100, scrollTop: 100 }))
    ).toEqual({
      canScrollUp: true,
      canScrollDown: false,
    });
  });
});

describe('getTagScrollStep', () => {
  it('returns 0 when the list has no tags', () => {
    expect(getTagScrollStep({ firstElementChild: null } as HTMLElement)).toBe(0);
  });

  it('adds the first tag height and row gap', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ rowGap: '4px' } as CSSStyleDeclaration);

    expect(
      getTagScrollStep({
        firstElementChild: { offsetHeight: 24 },
      } as unknown as HTMLElement)
    ).toBe(28);
  });
});

describe('scrollTagsByOne', () => {
  it('scrolls by one tag step', () => {
    const scrollBy = vi.fn();
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ rowGap: '4px' } as CSSStyleDeclaration);
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);

    scrollTagsByOne(
      {
        firstElementChild: { offsetHeight: 24 },
        scrollBy,
      } as unknown as HTMLElement,
      1
    );

    expect(scrollBy).toHaveBeenCalledWith({ top: 28, behavior: 'smooth' });
  });
});
