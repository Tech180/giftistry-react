# `app/providers/app-loading`

Single **full-page** loading host for the SPA. Pages and route guards do not mount their own viewport `LoadingState`; they call `show(message)` / `clear()` (or `useAppLoadingGate`) so [`AppContent`](../../app.component.tsx) renders one shared [`LoadingState`](../../../shared/ui/loading-state/loading-state.component.tsx) with `viewport` and the passed message.

## API

| Export | Role |
|--------|------|
| `AppLoadingProvider` | Stack of messages; `message` is the top entry (refcount so handoffs stay continuous) |
| `useAppLoading` | `{ message, show, clear }` — `show` pushes, `clear` pops |
| `useAppLoadingGate(active, message)` | `useLayoutEffect`: show while `active`, clear on deactivate / unmount |
| `RouteChunkFallback` | Content `Suspense` fallback — gates a path-derived message while a lazy chunk loads |

## Host

`AppContent` boot gate uses `LoadingState` (`"Loading..."`). After boot, the same component overlays Content when `message` is set.

Chunk fallback + page gate can overlap; the stack keeps the overlay up across that handoff (e.g. “Loading list…” through chunk + data).

## Not covered

Section/inline loaders (dashboard grid, friends list, settings Suspense, items spinner, buttons, tour preparing).
