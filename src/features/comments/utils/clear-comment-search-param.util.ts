import type { SetURLSearchParams } from 'react-router-dom';

export function clearCommentSearchParam(setSearchParams: SetURLSearchParams): void {
  setSearchParams(
    (prev) => {
      const next = new URLSearchParams(prev);
      next.delete('comment');
      return next;
    },
    { replace: true }
  );
}
