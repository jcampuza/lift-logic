# Agent Guidelines for Lift-PRS TanStack App

## Build & Development Commands

- **Development**: `bun run dev` (runs Convex dev + web concurrently)
- **Web dev only**: `bun run dev:web`
- **Build**: `bun run build` (includes TypeScript check)
- **Format**: `bun run format` (Prettier)
- **TypeScript watch**: `bun run dev:ts`

## Testing

No test framework currently configured. Use Vitest if adding tests.

## Code Style Guidelines

### Formatting

- **Prettier config**: No semicolons, single quotes, trailing commas
- **Imports**: Group by external libraries first, then internal with `@/` path alias
- **File extensions**: `.tsx` for React components, `.ts` for utilities/hooks

### TypeScript

- **Strict mode**: Enabled with unused locals/parameters checks
- **Path mapping**: `@/*` maps to `./src/*`
- **Type imports**: Use `import type` for type-only imports
- **Generic types**: Use `Id<'tableName'>` for Convex document IDs

### React Components

- **Client directive**: Use `'use client'` for components with hooks/interactivity
- **Functional components**: Preferred over class components
- **Props interface**: Define inline or as separate interface
- **Event handlers**: Use arrow functions or useCallback for stability

### Naming Conventions

- **Components**: PascalCase (e.g., `AddExerciseDialog`)
- **Hooks**: camelCase with `use` prefix (e.g., `useExerciseSearch`)
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase, descriptive names

### Error Handling

- **Convex functions**: Use proper validators and error throwing
- **React**: Handle loading/error states appropriately
- **Async operations**: Use try/catch with meaningful error messages

## Cursor Rules

Follow all Convex guidelines from `.cursor/rules/convex_rules.mdc`:

- Use new function syntax for Convex functions
- Always include argument and return validators
- Use proper function references and internal functions
- Follow schema design best practices
- Use TypeScript helpers like `Id<'tableName'>` for type safety
