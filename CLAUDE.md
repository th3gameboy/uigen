# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe React components in natural language, and the AI generates code rendered in real-time via an iframe preview.

## Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run dev:daemon       # Run dev server in background (logs to logs.txt)

# Building & Production
npm run build            # Build for production
npm run start            # Start production server

# Testing & Linting
npm test                 # Run Vitest test suite
npm run lint             # Run ESLint

# Database
npm run setup            # Install deps, generate Prisma client, run migrations
npm run db:reset         # Reset database (force removes migration history)
```

## Tech Stack

- **Next.js 15** with App Router and React 19
- **TypeScript 5** with strict mode
- **Tailwind CSS v4** for styling
- **shadcn/ui** (New York style) with Radix UI primitives
- **Vercel AI SDK** with Anthropic (Claude Haiku 4.5 default)
- **Monaco Editor** for code editing
- **Prisma** with SQLite
- **Vitest** with React Testing Library

## Architecture

### Core Concepts

1. **Virtual File System** (`src/lib/file-system.ts`): In-memory file system used for isolated project workspaces. No disk writes. Supports CRUD operations, rename, and serialization for persistence.

2. **Chat-Driven Generation**: Users chat with AI in left panel. AI uses tools (`str_replace_editor`, `file_manager`) to modify the virtual file system. Changes appear in code editor and live preview.

3. **Live Preview** (`src/components/preview/PreviewFrame.tsx`): Sandboxed iframe renders components using Babel standalone for browser-based JSX transformation. Entry point is `/App.jsx` or `/App.tsx`.

### Key Directories

- `src/app/` - Next.js App Router pages (root layout, project pages)
- `src/actions/` - Server actions for project CRUD
- `src/components/` - React components organized by feature (auth, chat, editor, preview, ui)
- `src/lib/contexts/` - React Context providers (ChatContext, FileSystemContext)
- `src/lib/tools/` - AI tool definitions (str-replace, file-manager)
- `src/lib/prompts/` - System prompts for Claude
- `src/lib/transform/` - JSX/TSX transformation and import map generation for live preview

### State Management

- **FileSystemContext**: Manages virtual file system state
- **ChatContext**: Manages chat messages and AI interactions via Vercel AI SDK's `useChat`

### Authentication

JWT-based with 7-day expiration, HttpOnly cookies. Protected routes: `/api/projects`, `/api/filesystem`. Middleware in `src/middleware.ts`.

### Database Schema

Defined in `prisma/schema.prisma`. Reference this file for database structure.

- **User**: id, email, password, createdAt, updatedAt, projects[]
- **Project**: id, name, userId (optional for anonymous), messages (JSON string), data (JSON file system state), createdAt, updatedAt, user (cascade delete)

## Import Aliases

Use `@/*` for imports from `src/` directory (configured in tsconfig.json).

## AI System Prompt

When generating components, Claude is instructed to:
- Create React components with Tailwind CSS
- Use virtual file system with `/` as root
- Generate `/App.jsx` as entry point
- Use `@/` import aliases within generated code

## Testing

Tests located in `__tests__/` directories adjacent to source files. Uses jsdom environment for browser-like testing.
