# Contributing to FlowBoard

Thank you for your interest in contributing to FlowBoard! This document provides guidelines and instructions for contributing.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/skillvee/flowboard-task.git
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

4. Initialize the database:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode (already configured in `tsconfig.json`)
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions

### Components

- Use function components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Follow the component structure in `src/components/`

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions/hooks**: camelCase (`useUserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)

### CSS/Styling

- Use Tailwind CSS utilities
- Extract repeated patterns into components
- Use the `cn()` utility for conditional classes

## Testing

### Running Tests

```bash
npm run test        # Run once
npm run test:watch  # Watch mode
```

### Writing Tests

- Place tests next to the code or in `tests/` directory
- Name test files with `.test.ts` or `.test.tsx` suffix
- Use descriptive test names

Example:
```typescript
describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });
});
```

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation changes

### Commit Messages

Follow conventional commits:

```
feat: add notification bell component
fix: correct task status color mapping
docs: update API documentation
refactor: extract useAsync hook
test: add tests for validation schemas
```

### Pull Requests

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting:
   ```bash
   npm run test
   npm run lint
   npm run typecheck
   ```
4. Submit a pull request
5. Wait for code review

## Code Review Checklist

- [ ] Code follows the style guide
- [ ] Tests are included and passing
- [ ] TypeScript types are correct
- [ ] No console.log or debug statements
- [ ] Documentation is updated if needed
- [ ] No breaking changes (or clearly documented)

## Getting Help

If you have questions or need help:

1. Check existing issues and documentation
2. Create a new issue with your question
3. Ask in the team Slack channel

## License

By contributing, you agree that your contributions will be licensed under the project's license.
