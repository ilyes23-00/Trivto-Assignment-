# Project Structure

This document explains the folder layout for the take-home assignment scaffold. It describes structure only, not feature implementation.

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
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma/
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
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── feed/
│   │       ├── feed-empty-state.tsx
│   │       ├── feed-error-state.tsx
│   │       ├── feed-item.tsx
│   │       ├── feed-skeleton.tsx
│   │       ├── image-feed.tsx
│   │       └── like-button.tsx
│   ├── hooks/
│   │   ├── use-infinite-feed.ts
│   │   └── use-like-image.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── feed-client.ts
│   │   │   └── likes-client.ts
│   │   └── server/
│   │       ├── likes-service.ts
│   │       └── picsum-service.ts
│   └── types/
│       ├── api.ts
│       ├── feed.ts
│       └── like.ts
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

This folder is reserved for static assets that can be served directly by Next.js. It is currently empty because the assignment structure is being set up before asset decisions are made.

### `src/`

This folder contains all application code. It keeps the project organized around feature boundaries and clean layering instead of mixing UI, server, and persistence concerns together.

### `src/app/`

This is the App Router entrypoint. It owns routes, layout composition, global styles, and the API route boundary for the project.

### `src/app/api/`

This folder holds backend HTTP route handlers owned by the Next.js application. It exists so the frontend can call internal endpoints instead of talking directly to external services or the database.

### `src/app/api/feed/`

This folder is reserved for the feed endpoint. It will later expose paginated image data through the backend proxy layer.

### `src/app/api/likes/`

This folder is reserved for like read and write endpoints. It will later coordinate persistent like state through Prisma.

### `src/components/`

This folder contains UI building blocks. It separates presentational concerns from hooks, services, and persistence logic.

### `src/components/feed/`

This feature folder groups all feed-specific visual pieces together. Keeping these components side-by-side makes the vertical feed easier to reason about and easier to explain in an interview.

### `src/hooks/`

This folder contains client-side state orchestration. It exists to keep component files focused on rendering while hooks own behavior such as pagination and like state.

### `src/lib/`

This folder contains shared infrastructure and low-level utilities. It is the right place for reusable setup code such as the Prisma client and shared constants.

### `src/services/`

This folder contains non-UI application logic. It separates data-fetching and backend concerns from pages and components.

### `src/services/api/`

This folder is reserved for frontend-facing fetch helpers that talk only to internal API routes. It prevents components from scattering raw fetch logic across the UI layer.

### `src/services/server/`

This folder is reserved for backend-only logic. It will later contain the Picsum proxy logic and Prisma-based like persistence logic.

### `src/types/`

This folder centralizes shared TypeScript contracts. It helps keep API routes, services, hooks, and components aligned on the same shapes.

## Notes

- The scaffold intentionally avoids feature implementation.
- Placeholder files exist so the final architecture is visible from the start.
- The structure is designed for readability, maintainability, and interview explainability.
