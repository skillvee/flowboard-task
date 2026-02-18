# FlowBoard

FlowBoard is a real-time project tracking platform built by TechFlow Inc. This repository contains the web application codebase.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use a free tier from [Supabase](https://supabase.com) or [Neon](https://neon.tech))

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd flowboard-task
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your database connection string.

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
flowboard/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   ├── projects/        # Project pages
│   │   ├── tasks/           # Task pages
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── ui/              # Base UI components
│   │   └── ...              # Feature components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── tests/                   # Test files
└── docs/                    # Documentation
```

## Features

- **Projects**: Create and manage projects with descriptions and deadlines
- **Tasks**: Create, assign, and track tasks within projects
- **Team Members**: Manage team members and assignments
- **Comments**: Discuss tasks with threaded replies
- **Activity Feed**: Track all changes across the platform

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Incident Log](./docs/INCIDENTS.md)

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for code style, branching, and PR guidelines.

## License

Proprietary - TechFlow Inc.
