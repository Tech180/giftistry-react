# `features/tour`

Product tutorial: demo sample list, beginner first-list walkthrough, and optional advanced chapters.

## Public surface

- `TourProvider` / `useTour` / `useTourOptional` / `TourHost`
- `TOUR_TARGETS`, `TOUR_DEMO_LIST_ID`, `isDemoListId`
- `TOUR_CHAPTERS`, `eligibleChapters`
- Demo: `useTourDemo` / `useTourDemoOptional` (client-only fixtures)

## Related

- Auth `PATCH /api/auth/tutorial` and `ApiUser.Tour`
- Settings account tutorial controls
