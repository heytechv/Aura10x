---
description: Project overview, tech stack, and shared rules for Aura.
globs:
alwaysApply: true
---
# AI Rules for Aura

AURA is a web desktop application (MVP) designed to help users manage their personal perfume collection. The primary goal is to provide a simple, elegant interface for users to create and browse their own digital perfume shelf.

## Tech Stack

- **Framework**: Astro 5
- **Language**: TypeScript 5
- **Frontend**: React 19
- **Styling**: Tailwind 4
- **UI Components**: Shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL, Auth, Storage)

## Project Structure

When introducing changes to the project, always follow the directory structure below:

- `./src` - source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend (Entities, DTOs)
- `./src/components` - Client-side components written in Astro (static) and React (dynamic)
- `./src/components/ui` - Client-side components from Shadcn/ui
- `./src/lib` - Services and helpers 
- `./src/assets` - static internal assets
- `./public` - public assets

When modifying the directory structure, always update this section.

## Coding practices

### Guidelines for clean code

- **Type Safety**: Use strict TypeScript types. Avoid `any`.
- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.
