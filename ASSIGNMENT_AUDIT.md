# Assignment Audit

## Audit Scope

This audit reviews the current codebase against the original assignment requirements. It also includes critical fixes applied during the audit so the final verdict reflects the best current submission rather than avoidable rough edges.

## Critical Fixes Applied During Audit

- Added a route-level error boundary in `src/app/error.tsx`.
- Added retry affordance to the initial full-page feed error state.
- Added explicit logging when likes bootstrap fails during first-page server render.
- Removed the unused scaffold hook `src/hooks/use-like-image.ts`.
- Removed an unnecessary duplicate client-side likes bootstrap fetch from `src/hooks/use-likes.ts`.
- Updated `README.md`, `PROJECT_STRUCTURE.md`, and `AI_WORKFLOW.md` to better match the actual implementation.
- Added JSDoc to a few exported UI symbols that were previously documented only on internal implementation functions.

## Requirement Review

### Requirement #1
Full-screen vertical image feed

Status: PASS

Evidence:
- `src/components/feed/feed-item.tsx`
- `src/components/feed/image-feed.tsx`

Notes:
- Each feed card uses `min-h-dvh` and fills the screen vertically.

### Requirement #2
One image per viewport

Status: PASS

Evidence:
- `src/components/feed/feed-item.tsx`

Notes:
- Each card is rendered as one full-screen article with a single background image.

### Requirement #3
Scroll snap behavior

Status: PASS

Evidence:
- `src/components/feed/image-feed.tsx`

Notes:
- The scroll container uses `snap-y snap-mandatory`.

### Requirement #4
Mobile-first experience

Status: PASS

Evidence:
- `src/components/feed/image-feed.tsx`
- `src/components/feed/feed-item.tsx`
- `src/app/globals.css`

Notes:
- Layout, spacing, overlays, and interaction model are optimized for narrow vertical screens first.

### Requirement #5
Real external image API

Status: PASS

Evidence:
- `src/services/server/picsum-service.ts`

Notes:
- Uses Lorem Picsum via `https://picsum.photos/v2/list`.

### Requirement #6
Backend proxy layer

Status: PASS

Evidence:
- `src/app/api/feed/route.ts`
- `src/services/server/feed-route-service.ts`
- `src/services/server/picsum-service.ts`

Notes:
- The frontend calls internal API routes, not the external image provider directly.

### Requirement #7
Infinite loading

Status: PASS

Evidence:
- `src/hooks/use-infinite-feed.ts`
- `src/components/feed/image-feed.tsx`

Notes:
- Additional pages load when the sentinel approaches the viewport.

### Requirement #8
Pagination

Status: PASS

Evidence:
- `src/services/server/picsum-service.ts`
- `src/services/server/feed-route-service.ts`
- `src/types/feed.ts`

Notes:
- Uses page-based pagination with validated `page` and `limit` parameters.

### Requirement #9
Like interaction

Status: PASS

Evidence:
- `src/components/feed/like-button.tsx`
- `src/components/feed/feed-item.tsx`
- `src/hooks/use-likes.ts`

Notes:
- Supports explicit button-based like/unlike plus double tap to like.

### Requirement #10
Like persistence

Status: PASS

Evidence:
- `src/services/server/likes-service.ts`
- `src/database/repositories/like-repository.ts`
- `prisma/schema.prisma`

Notes:
- Writes go through Prisma into SQLite.

### Requirement #11
Persistence after refresh

Status: PASS

Evidence:
- `src/app/page.tsx`
- `src/services/server/likes-service.ts`
- `src/hooks/use-likes.ts`

Notes:
- Liked image IDs are bootstrapped from the backend on first render.

### Requirement #12
Loading state

Status: PASS

Evidence:
- `src/app/loading.tsx`
- `src/components/feed/feed-skeleton.tsx`

Notes:
- Covers both initial route load and follow-up page loading.

### Requirement #13
Empty state

Status: PASS

Evidence:
- `src/components/feed/feed-empty-state.tsx`

Notes:
- Clear message for successful-but-empty feed responses.

### Requirement #14
Error state

Status: PASS

Evidence:
- `src/components/feed/feed-error-state.tsx`
- `src/app/error.tsx`
- `src/app/page.tsx`

Notes:
- Includes blocking error states plus route-level error boundary support.

### Requirement #15
API keys protected

Status: PASS

Evidence:
- `src/services/server/picsum-service.ts`
- `.env.example`

Notes:
- No API keys are used or exposed.

### Requirement #16
Backend owned by us

Status: PASS

Evidence:
- `src/app/api/feed/route.ts`
- `src/app/api/likes/route.ts`
- `src/services/server/*`

Notes:
- HTTP boundary is fully inside the app.

### Requirement #17
Clean architecture

Status: PASS

Evidence:
- `src/app/*`
- `src/components/*`
- `src/hooks/*`
- `src/services/*`
- `src/database/*`

Notes:
- Responsibilities are clearly separated by layer.

### Requirement #18
Double tap to like

Status: PASS

Evidence:
- `src/components/feed/feed-item.tsx`
- `src/app/globals.css`
- `DOUBLE_TAP.md`

Notes:
- Gesture is mobile-friendly and keeps the button as the accessible primary control.

### Requirement #19
Next.js App Router

Status: PASS

Evidence:
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/app/api/*`

### Requirement #20
TypeScript

Status: PASS

Evidence:
- `tsconfig.json`
- `src/**/*.ts`
- `src/**/*.tsx`

### Requirement #21
Prisma

Status: PASS

Evidence:
- `prisma/schema.prisma`
- `src/lib/prisma.ts`
- `src/database/repositories/like-repository.ts`

### Requirement #22
SQLite

Status: PASS

Evidence:
- `prisma/schema.prisma`
- `.env.example`
- `prisma/migrations/20260617184831_initial_schema/migration.sql`

### Requirement #23
API routes

Status: PASS

Evidence:
- `src/app/api/feed/route.ts`
- `src/app/api/likes/route.ts`

### Requirement #24
Environment variables

Status: PASS

Evidence:
- `.env.example`
- `.env`
- `prisma/schema.prisma`

### Requirement #25
No secrets in frontend

Status: PASS

Evidence:
- `src/components/*`
- `src/hooks/*`

Notes:
- No secrets or provider credentials are embedded in client code.

### Requirement #26
Build passes

Status: PASS

Evidence:
- Verified during audit with `npm run build`

### Requirement #27
Lint passes

Status: PASS

Evidence:
- Verified during audit with `npm run lint`

### Requirement #28
Separation of concerns

Status: PASS

Evidence:
- `src/components/feed/*`
- `src/hooks/*`
- `src/services/*`
- `src/database/*`

### Requirement #29
Service layer

Status: PASS

Evidence:
- `src/services/server/feed-route-service.ts`
- `src/services/server/likes-service.ts`
- `src/services/server/likes-route-service.ts`

### Requirement #30
Repository layer

Status: PASS

Evidence:
- `src/database/repositories/like-repository.ts`

### Requirement #31
Reusable components

Status: PASS

Evidence:
- `src/components/feed/feed-state-frame.tsx`
- `src/components/feed/feed-inline-state.tsx`
- `src/components/feed/feed-skeleton.tsx`
- `src/components/feed/like-button.tsx`

### Requirement #32
Strong typing

Status: PASS

Evidence:
- `src/types/*`
- `prisma/schema.prisma`
- `src/services/*`

Notes:
- Types are broadly explicit and propagated through layers.

### Requirement #33
Error boundaries where appropriate

Status: PASS

Evidence:
- `src/app/error.tsx`
- `src/app/page.tsx`

### Requirement #34
Proper validation

Status: PARTIAL

Evidence:
- `src/services/server/feed-route-service.ts`
- `src/services/server/likes-route-service.ts`
- `src/services/server/picsum-service.ts`

Notes:
- Input validation for internal API routes is solid.
- External provider payload validation only verifies that the payload is an array, not that each item matches the expected shape.

Root cause:
- Provider response validation stops at array-level shape instead of validating individual records.

Risk level:
- Medium

Recommended fix:
- Add runtime validation for each Picsum item, either with manual guards or a schema library such as Zod.

Estimated effort:
- 2 to 4 hours

### Requirement #35
No duplicated logic

Status: PARTIAL

Evidence:
- `src/services/api/feed-client.ts`
- `src/services/api/likes-client.ts`
- `src/components/feed/image-feed.tsx`

Notes:
- Overall duplication is low, but request error parsing and response handling patterns are repeated across multiple API client helpers.

Root cause:
- Shared request helper utilities were only partially extracted.

Risk level:
- Low

Recommended fix:
- Extract a shared internal fetch helper for JSON parsing, safe error conversion, and status-based error classification.

Estimated effort:
- 1 to 2 hours

### Requirement #36
IntersectionObserver

Status: PASS

Evidence:
- `src/hooks/use-infinite-feed.ts`
- `INFINITE_SCROLL.md`

### Requirement #37
No duplicate fetches

Status: PASS

Evidence:
- `src/hooks/use-infinite-feed.ts`
- `src/hooks/use-likes.ts`
- `src/services/api/feed-client.ts`
- `src/services/api/likes-client.ts`

Notes:
- Hook-level in-flight guards and client-level in-flight promise sharing are both present.

### Requirement #38
No memory leaks

Status: PASS

Evidence:
- `src/hooks/use-infinite-feed.ts`
- `src/hooks/use-likes.ts`
- `src/components/feed/feed-item.tsx`

Notes:
- Observer cleanup, abort cleanup, and animation timeout cleanup are all implemented.

### Requirement #39
Reasonable rerender behavior

Status: PASS

Evidence:
- `src/components/feed/feed-item.tsx`
- `src/components/feed/like-button.tsx`
- `src/components/feed/image-feed.tsx`

Notes:
- Feed items and like buttons are memoized, and callback identity is stabilized.

### Requirement #40
Image preloading

Status: PASS

Evidence:
- `src/hooks/use-image-preload.ts`
- `src/components/feed/feed-item.tsx`

### Requirement #41
Infinite scroll remains smooth

Status: PASS

Evidence:
- `src/hooks/use-infinite-feed.ts`
- `src/components/feed/image-feed.tsx`
- `src/lib/constants.ts`

Notes:
- Scroll listeners are avoided, loading starts early with `rootMargin`, and the interaction model is lightweight for the current scale.

### Requirement #42
Smooth scrolling

Status: PASS

Evidence:
- `src/app/globals.css`
- `src/components/feed/image-feed.tsx`

### Requirement #43
Loading skeleton

Status: PASS

Evidence:
- `src/components/feed/feed-skeleton.tsx`

### Requirement #44
Retry handling

Status: PASS

Evidence:
- `src/components/feed/feed-inline-state.tsx`
- `src/components/feed/feed-error-state.tsx`
- `src/app/page.tsx`
- `src/app/error.tsx`

### Requirement #45
Empty state messaging

Status: PASS

Evidence:
- `src/components/feed/feed-empty-state.tsx`

### Requirement #46
Error messaging

Status: PASS

Evidence:
- `src/components/feed/feed-error-state.tsx`
- `src/components/feed/feed-inline-state.tsx`
- `src/types/api.ts`

### Requirement #47
Like feedback

Status: PASS

Evidence:
- `src/components/feed/feed-item.tsx`
- `src/components/feed/like-button.tsx`
- `src/hooks/use-likes.ts`

Notes:
- Includes optimistic UI, pending state, rollback, and gesture animation.

### Requirement #48
Mobile usability

Status: PASS

Evidence:
- `src/components/feed/feed-item.tsx`
- `src/components/feed/image-feed.tsx`
- `src/app/globals.css`

### Requirement #49
README.md

Status: PASS

Evidence:
- `README.md`

### Requirement #50
AI_WORKFLOW.md

Status: PASS

Evidence:
- `AI_WORKFLOW.md`

### Requirement #51
PROJECT_STRUCTURE.md

Status: PASS

Evidence:
- `PROJECT_STRUCTURE.md`

### Requirement #52
API_DOCUMENTATION.md

Status: PASS

Evidence:
- `API_DOCUMENTATION.md`

### Requirement #53
DATABASE.md

Status: PASS

Evidence:
- `DATABASE.md`

### Requirement #54
INTERVIEW_NOTES.md

Status: PASS

Evidence:
- `INTERVIEW_NOTES.md`

### Requirement #55
File-level comments

Status: PASS

Evidence:
- `src/app/*`
- `src/components/feed/*`
- `src/hooks/*`
- `src/services/*`
- `src/database/*`
- `src/lib/*`

### Requirement #56
JSDoc on exported functions

Status: PASS

Evidence:
- `src/app/page.tsx`
- `src/app/loading.tsx`
- `src/app/layout.tsx`
- `src/components/feed/*`
- `src/services/*`
- `src/database/*`

### Requirement #57
Clear explanation of business logic

Status: PASS

Evidence:
- `src/hooks/use-infinite-feed.ts`
- `src/hooks/use-likes.ts`
- `src/database/helpers/like-query-helpers.ts`
- `src/services/server/picsum-service.ts`

### Requirement #58
Real prompts included

Status: PASS

Evidence:
- `AI_WORKFLOW.md`

### Requirement #59
AI mistake documented

Status: PASS

Evidence:
- `AI_WORKFLOW.md`

### Requirement #60
Verification process documented

Status: PASS

Evidence:
- `AI_WORKFLOW.md`

### Requirement #61
Human review documented

Status: PASS

Evidence:
- `AI_WORKFLOW.md`

### Requirement #62
Not exaggerated

Status: PASS

Evidence:
- `AI_WORKFLOW.md`

### Requirement #63
No API keys exposed

Status: PASS

Evidence:
- `.env.example`
- `src/services/server/picsum-service.ts`
- `src/components/*`

### Requirement #64
Input validation

Status: PASS

Evidence:
- `src/services/server/feed-route-service.ts`
- `src/services/server/likes-route-service.ts`

### Requirement #65
Safe API responses

Status: PASS

Evidence:
- `src/services/server/feed-route-service.ts`
- `src/services/server/likes-route-service.ts`
- `src/types/api.ts`

### Requirement #66
Proper error handling

Status: PASS

Evidence:
- `src/components/feed/feed-error-state.tsx`
- `src/components/feed/feed-inline-state.tsx`
- `src/services/server/likes-route-service.ts`
- `src/services/server/feed-route-service.ts`

### Requirement #67
No internal stack traces leaked

Status: PASS

Evidence:
- `src/services/server/feed-route-service.ts`
- `src/services/server/likes-route-service.ts`

Notes:
- Detailed errors are logged internally and safe JSON responses are returned to clients.

## Interview Risks

### Why Prisma over direct SQLite?

Risk:
- An interviewer may ask whether Prisma is overkill for one table.

Ideal answer:
- Prisma gave type-safe access, cleaner schema evolution, and a repository layer that is easier to test and explain. For a take-home project it also keeps SQL boilerplate low while still using real persistence.

### Why use a repository pattern here?

Risk:
- It can look like over-abstraction in a small project.

Ideal answer:
- The repository is intentionally thin. Its value is not scale for scale’s sake; it isolates Prisma calls, keeps services and routes interview-friendly, and makes query intent explicit.

### Why `IntersectionObserver` instead of scroll listeners?

Risk:
- The choice needs to sound deliberate, not copied from a prompt.

Ideal answer:
- It matches the requirement directly and is the right browser primitive for visibility-based pagination. It avoids high-frequency scroll calculations and makes early loading straightforward through `rootMargin`.

### Why optimistic likes?

Risk:
- Interviewers may ask about failure modes and consistency.

Ideal answer:
- The interaction feels much better when the UI updates immediately. The implementation still protects correctness by locking each image while its write is in flight and rolling back the UI if the request fails.

### Why is provider validation only partial?

Risk:
- A strong interviewer may notice that provider payload validation checks only array shape.

Ideal answer:
- For the take-home scope, array-level validation covered the main failure mode quickly. If this moved closer to production, I would tighten runtime validation to each item shape with Zod or manual guards.

### Why no virtualization?

Risk:
- Infinite lists often raise virtualization questions.

Ideal answer:
- At this assignment’s current scale, virtualization would add implementation complexity before it materially improved UX. I instead focused on memoization, preloading, request dedupe, and keeping the feed scroll path lightweight.

## Production Readiness Score

- Architecture: 8/10
- Code Quality: 8/10
- Performance: 8/10
- UX: 8/10
- Security: 9/10
- Documentation: 8/10
- Maintainability: 8/10

## Final Verdict

Answer:

CONDITIONAL PASS

Why:

- The submission satisfies the core assignment requirements and the stretch goal.
- The architecture is clear, the feature set is complete, and the codebase is explainable in an interview.
- The main weaknesses are not in core functionality, but in polish:
  - provider payload validation could be stronger
  - some request helper logic is still duplicated
  - several historical planning docs are older than the final implementation and should be treated as planning artifacts rather than final truth

If I were hiring, I would pass this candidate forward with follow-up discussion focused on tradeoffs, validation depth, and where they intentionally stopped to avoid overengineering.
