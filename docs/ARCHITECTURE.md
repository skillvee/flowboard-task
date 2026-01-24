# FlowBoard Architecture

This document describes the high-level architecture of FlowBoard.

## Overview

FlowBoard is a real-time project tracking platform built with Next.js 15 using the App Router. It follows a server-first approach where most data fetching happens on the server via React Server Components.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library

## Project Structure

```
flowboard/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes (REST endpoints)
│   │   ├── projects/        # Project pages
│   │   ├── tasks/           # Task pages
│   │   ├── team/            # Team pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Dashboard page
│   │   └── globals.css      # Global styles
│   │
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components (Button, Input, etc.)
│   │   ├── header.tsx       # App header
│   │   ├── project-card.tsx # Project card component
│   │   ├── task-card.tsx    # Task card component
│   │   └── activity-feed.tsx # Activity feed
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── use-tasks.ts     # Task CRUD operations
│   │   └── use-projects.ts  # Project CRUD operations
│   │
│   ├── lib/                 # Utility functions
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── utils.ts         # Helper functions
│   │   └── validations.ts   # Zod schemas
│   │
│   └── types/               # TypeScript type definitions
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
│
├── tests/                   # Test files
│   ├── setup.ts             # Test setup
│   ├── lib/                 # Library tests
│   └── components/          # Component tests
│
└── docs/                    # Documentation
```

## Data Flow

### Server Components (Default)

Most pages are React Server Components that fetch data directly from the database:

```
Browser Request → Next.js Route → Server Component → Prisma → PostgreSQL
                                        ↓
                                  HTML Response
```

### Client Components

Interactive features use client components with hooks that call API routes:

```
User Action → Client Hook → fetch() → API Route → Prisma → PostgreSQL
                   ↓
            State Update → Re-render
```

### API Routes

API routes handle CRUD operations and return JSON:

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

Similar patterns for tasks, comments, and users.

## Database Schema

The main entities are:

- **User**: Application users
- **Project**: Top-level organizational unit
- **ProjectMember**: Many-to-many relationship between users and projects
- **Task**: Work items within a project
- **Label**: Tags for categorizing tasks
- **Comment**: Discussion threads on tasks
- **Activity**: Audit log for all actions

See `prisma/schema.prisma` for the full schema.

## Component Architecture

### UI Components

Located in `src/components/ui/`, these are foundational components:

- Stateless or minimally stateful
- Accept props for customization
- Follow consistent styling patterns
- Export from `index.ts` for easier imports

### Feature Components

Located in `src/components/`, these combine UI components:

- May fetch data (as server components)
- Compose multiple UI components
- Handle feature-specific logic

## Testing Strategy

- **Unit Tests**: For utility functions and validations
- **Component Tests**: For UI components using Testing Library
- **API Tests**: For API routes (TODO: add integration tests)

Run tests with:

```bash
npm run test
```

## Known Gaps

### Real-time Updates

The app currently has no real-time update mechanism. All data is fetched on page load or via manual API calls. This means:

- Task assignment changes don't propagate to the UI until refresh
- The activity feed is only updated on page navigation
- The bell icon in the header is non-functional (placeholder)

Marcus (previous contractor) explored Server-Sent Events but ran into Vercel serverless limitations. His notes are in `src/lib/notifications.ts`. See also `docs/INCIDENTS.md` for the business impact of this gap.

### Authentication

Authentication is stubbed out — API routes use a hardcoded `temp-user-id`. There are TODO comments marking where session-based auth should go. This is a known limitation but not the current priority.

## Deployment Notes

- Hosted on **Vercel** (Hobby plan currently, Pro plan pending budget approval)
- Vercel serverless functions have a **10-second timeout** on the Hobby plan
- **Edge Runtime** is available and has a longer timeout (up to 30s), but requires edge-compatible dependencies
- Database is hosted on Neon (serverless PostgreSQL)

### Caching

Consider implementing:

- React Query or SWR for client-side caching
- Next.js ISR for static pages
- Redis for session and real-time data
