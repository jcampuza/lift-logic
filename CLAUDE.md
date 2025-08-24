# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `bun run dev` - Start both frontend and backend in parallel
- `bun run dev:frontend` - Start Next.js development server only
- `bun run dev:backend` - Start Convex backend only
- `bun run predev` - Sets up Convex dev environment and opens dashboard

### Build & Deploy

- `bun run build` - Build Next.js application for production
- `bun run start` - Start production Next.js server

### Code Quality

- `bun run lint` - Run Eslint linter (check for issues)
- `bun run lint:fix` - Run Eslint linter and auto-fix issues
- `bun run format` - Format code with prettier
- `bun run format:check` - Check code formatting with prettier

## Architecture Overview

This is a full-stack workout tracking application built with:

### Frontend Stack

- **Next.js 15** with App Router for the web application
- **React 19** for UI components
- **Tailwind CSS** for styling with custom component library in `/components/ui/`
- **Radix UI** components for accessible UI primitives
- **TypeScript** for type safety

### Backend Stack

- **Convex** for backend services (database, server functions, real-time sync)
- **Convex Auth** for authentication with server-side providers

### Database Schema

Core entities defined in `convex/schema.ts`:

- `globalExercises` - Shared exercise catalog available to all users
- `userExercises` - User-created custom exercises
- `workouts` - User workout sessions with exercise items and sets

### Key Application Structure

**Frontend Pages:**

- `/` - Main dashboard showing workout history
- `/workouts/[id]` - Individual workout editor/viewer
- `/settings` - User settings
- `/signin` - Authentication page

**Backend Functions (`convex/myFunctions.ts`):**

- Workout CRUD operations (list, get, create, update, delete)
- Exercise search across global and user exercises
- User exercise creation

**Component Architecture:**

- Reusable UI components in `/components/ui/`
- Business logic components in `/components/`
- Page-specific components co-located with pages in `/app/`

### Data Flow

- Convex provides real-time reactive queries via `useQuery()` hooks
- Mutations via `useMutation()` for data changes
- Authentication state managed through `useConvexAuth()`
- Exercise references support both global and user-specific exercises

### Loading States & Skeleton Pattern

**Always use skeleton components for loading states instead of simple text messages.**

Available skeleton components:
- `WorkoutSkeleton` - Single workout item skeleton (matches main page workout cards)
- `WorkoutListSkeleton` - List of workout skeletons with customizable count
- `WorkoutDetailSkeleton` - Full workout detail page skeleton
- `Skeleton` - Base skeleton component from `/components/ui/skeleton.tsx`

**Usage Guidelines:**
- Use `WorkoutListSkeleton` on main page when `workouts === undefined`
- Use `WorkoutDetailSkeleton` on workout detail pages during loading states
- Create page-specific skeleton components that match the actual content layout
- Skeleton components should mirror the structure and approximate sizing of real content
- Always prefer skeleton loading over simple "Loading..." text messages

### Development Setup

After cloning, run `npm install && npm run dev` to start the development environment. The `predev` script handles Convex setup automatically.
