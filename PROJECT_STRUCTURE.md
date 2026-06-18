# Project Structure

This document explains the current folder layout for the take-home assignment implementation. It focuses on where responsibilities live in the working codebase.

## Tree View

```text
Trivto/
├── .env
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── ARCHITECTURE.md
├── PROJECT_STRUCTURE.md
├── docs/
│   └── superpowers/
│       ├── plans/
│       │   └── 2026-06-17-tiktok-style-image-feed-implementation-plan.md
│       └── specs/
│           └── 2026-06-17-tiktok-style-image-feed-design.md
├── AI_WORKFLOW.md
├── API_DOCUMENTATION.md
├── DATABASE.md
├── INTERVIEW_NOTES.md
├── LIKE_SYSTEM.md
├── PERFORMANCE.md
├── STATES.md
├── DOUBLE_TAP.md
├── INFINITE_SCROLL.md
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── rules.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feed/
│   │   │   │   └── route.ts
│   │   │   └── likes/
│   │   │       └── route.ts
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── feed/
│   │       ├── feed-empty-state.tsx
│   │       ├── feed-error-state.tsx
│   │       ├── feed-inline-state.tsx
│   │       ├── feed-item.tsx
│   │       ├── feed-skeleton.tsx
│   │       ├── feed-state-frame.tsx
│   │       ├── image-feed.tsx
│   │       ├── image-load-failure-state.tsx
│   │       └── like-button.tsx
│   ├── database/
│   │   ├── helpers/
│   │   └── repositories/
│   ├── hooks/
│   │   ├── use-image-preload.ts
│   │   ├── use-infinite-feed.ts
│   │   └── use-likes.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── mappers/
│   │   └── picsum-feed-mapper.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── feed-client.ts
│   │   │   └── likes-client.ts
│   │   └── server/
│   │       ├── feed-route-service.ts
│   │       ├── likes-route-service.ts
│   │       ├── likes-service.ts
│   │       └── picsum-service.ts
│   └── types/
│       ├── api.ts
│       ├── feed.ts
│       ├── like.ts
│       └── picsum.ts
└── tsconfig.json
```

## Folder Explanations

### Root

The root holds project-wide configuration, package management, architecture notes, and environment files. This is where framework tooling starts when the app runs, builds, lints, or uses Prisma.

### `docs/`

This folder stores planning and design artifacts for the assignment. It supports interview explainability by preserving the design decisions and implementation plan separately from production source code.

### `docs/superpowers/specs/`

This folder contains the approved design specification. It explains why the system is shaped the way it is before implementation begins.

### `docs/superpowers/plans/`

This folder contains the phase-by-phase execution plan. It is useful for incremental delivery and for explaining how the project would be built safely.

### `prisma/`

This folder owns schema definitions for the database layer. Prisma CLI reads this folder to understand models and generate database artifacts for SQLite-backed persistence.

### `public/`

This folder contains static assets served directly by Next.js. In this project it mainly holds framework placeholder assets rather than feed-specific product assets.

### `src/`

This folder contains all application code. It keeps the project organized around feature boundaries and clean layering instead of mixing UI, server, and persistence concerns together.

### `src/app/`

This is the App Router entrypoint. It owns routes, layout composition, global styles, and the API route boundary for the project.

### `src/app/api/`

This folder holds backend HTTP route handlers owned by the Next.js application. It exists so the frontend can call internal endpoints instead of talking directly to external services or the database.

### `src/app/api/feed/`

This folder exposes the paginated backend-owned feed endpoint.

### `src/app/api/likes/`

This folder exposes backend endpoints for reading and persisting likes.

### `src/components/`

This folder contains UI building blocks. It separates presentational concerns from hooks, services, and persistence logic.

### `src/components/feed/`

This feature folder groups the feed cards, like UI, reusable state components, and image failure fallback in one place.

### `src/database/`

This folder contains the database-facing helper and repository layers. It keeps Prisma query details out of route handlers and UI code.

### `src/hooks/`

This folder contains client-side state orchestration. It exists to keep component files focused on rendering while hooks own behavior such as pagination and like state.

### `src/lib/`

This folder contains shared infrastructure and low-level utilities. It is the right place for reusable setup code such as the Prisma client and shared constants.

### `src/services/`

This folder contains non-UI application logic. It separates data-fetching and backend concerns from pages and components.

### `src/services/api/`

This folder contains frontend-facing fetch helpers that talk only to internal API routes. It also centralizes request error parsing and in-flight request sharing.

### `src/services/server/`

This folder contains backend-only logic including route-facing service wrappers, Picsum proxy behavior, and like persistence orchestration.

### `src/types/`

This folder centralizes shared TypeScript contracts. It helps keep API routes, services, hooks, and components aligned on the same shapes.

## Notes

- The project is organized around clean boundaries rather than a strict monolith by file type only.
- The `docs/superpowers/` files are historical planning artifacts and are not the source of truth for the final implementation.
- The structure is designed for readability, maintainability, and interview explainability.
