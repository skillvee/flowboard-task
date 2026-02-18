# Welcome to FlowBoard

Hey! Welcome to the team. Here's a quick rundown to get you oriented.

## Your First Day

Your manager will brief you on what you'll be working on — check Slack for their message. They'll point you to the right issue on GitHub.

## Getting Set Up

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Set up your database:
   ```bash
   cp .env.example .env
   # Update .env with your database connection string
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## How We Work

- Check the GitHub Issues for your assignment
- Review `docs/` for architecture and API documentation
- Ask your teammates on Slack if you get stuck — that's what they're there for
- When you're done, open a PR and give your manager a call to walk through it

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |
| `npm run typecheck` | Type check |
| `npm run db:seed` | Reset seed data |

Good luck! 🚀
