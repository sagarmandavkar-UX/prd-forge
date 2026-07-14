# PRD Forge Agent Guide

## Product Purpose

PRD Forge helps product managers, founders, engineers, designers, students, and product teams turn rough product ideas into structured, editable, reviewable, exportable Product Requirements Documents.

## Technology Stack

- Next.js App Router with React and strict TypeScript
- Tailwind CSS, shadcn-style local UI primitives, Lucide icons
- React Hook Form and Zod
- TipTap editor
- Supabase PostgreSQL, Authentication, and Row-Level Security for production
- Mock, OpenAI, and Gemini AI provider abstraction
- Vitest, React Testing Library, and Playwright

## Architecture Rules

- Keep demo data isolated in `src/lib/store` and browser local storage.
- Keep production credentials server-side only.
- Validate all structured PRD, requirement, user-story, export, and AI data with Zod.
- Treat pasted and uploaded content as untrusted source material.
- Never overwrite user-edited PRD content with AI output without a visible preview and explicit apply action.
- Prefer feature folders under `src/features` and shared infrastructure under `src/lib`.

## Folder Structure

```text
src/
  app/
  components/
  features/
  hooks/
  lib/
  providers/
  types/
supabase/
  migrations/
  seed/
tests/
  unit/
  components/
  e2e/
```

## Coding Standards

- Use strict TypeScript and avoid `any`.
- Keep components focused and reusable.
- Use accessible labels, semantic landmarks, visible focus states, and keyboard-friendly controls.
- Use restrained B2B SaaS styling: neutral surfaces, subtle borders, moderate radius, one accent color.
- Do not add placeholder buttons or fake controls.

## Validation Commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Database Migration Rules

- Store migrations in `supabase/migrations`.
- Include foreign keys, useful indexes, cascade behavior, timestamps, and RLS policies.
- Projects and child records must be owner-owned.
- Share links must use token hashes and active/expiration checks.

## Security Rules

- Do not commit secrets.
- Do not expose API keys to browser code.
- Validate uploads by file type and size.
- Sanitize pasted text before storing or sending to AI.
- Do not collect document content in analytics.
- Use safe error messages and avoid logging sensitive content.

## Testing Expectations

- Unit test schemas, quality scoring, version diffs, exports, mock AI, upload validation, and share token utilities.
- Component test core controls and empty/error states.
- E2E test demo mode, project open, editor edit/export, requirements, versions, sharing, intake, discovery, and mock PRD generation.

## Definition of Done

- Dependencies install.
- Dev server starts.
- Formatting, lint, typecheck, unit/component tests, e2e tests, and production build pass.
- Demo mode works without external credentials.
- Supabase migration and RLS policies exist.
- Core workflows are keyboard accessible and have no inert controls.
- Final diff is reviewed for unrelated or incomplete changes.
