# PRD Forge

Turn product ideas into clear, actionable requirements.

PRD Forge is a Next.js App Router application for generating, editing, scoring, versioning, exporting, and sharing Product Requirements Documents. It includes a full local demo mode that works without Supabase or external AI credentials, plus production-ready integration points for Supabase Auth/PostgreSQL/RLS and server-side AI providers.

## Tech Stack

- Next.js App Router, React, TypeScript strict mode
- Tailwind CSS, shadcn-style primitives, Lucide icons
- React Hook Form and Zod validation
- TipTap rich-text editor
- Supabase Auth/PostgreSQL/RLS migration files
- AI provider abstraction for mock, OpenAI, and Gemini
- Vitest, React Testing Library, Playwright
- Server route exports for Markdown, text, JSON, PDF, DOCX, and CSV

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then choose demo mode. Demo data is stored in browser local storage under `prd-forge.demo-state`.

## Environment

Copy `.env.example` to `.env.local` and fill production values when needed:

```bash
cp .env.example .env.local
```

Demo mode uses `AI_PROVIDER=mock` and does not require credentials.

## Supabase

Run migrations after creating a Supabase project:

```bash
npm run db:migrate
```

Seed guidance is in `supabase/seed/demo_seed.sql`. Production access is private by default through Row-Level Security. Share links use unguessable tokens and store hashes server-side.

## AI Providers

Set `AI_PROVIDER=mock`, `openai`, or `gemini`.

```bash
AI_PROVIDER=mock
OPENAI_API_KEY=
GOOGLE_GEMINI_API_KEY=
```

The mock provider powers demo mode and automated tests. Real providers are selected only in server code so API keys are not exposed to the browser.

## Validation Commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Main Routes

- `/` landing page
- `/login`, `/signup`, `/forgot-password`
- `/dashboard`
- `/projects/new`
- `/projects/[projectId]`
- `/projects/[projectId]/discovery`
- `/projects/[projectId]/prd`
- `/projects/[projectId]/requirements`
- `/projects/[projectId]/versions`
- `/templates`
- `/settings`
- `/help`
- `/privacy`
- `/terms`
- `/share/[token]`

## Known Limitations

- Demo persistence is local to the current browser and intentionally does not mix with production data.
- The OpenAI and Gemini adapters currently use the provider for idea analysis and fall back to deterministic mock generation for full structured PRD workflows unless expanded.
- Demo sharing is simulated with local storage; production should resolve hashed tokens server-side through Supabase.

## Deployment

For Vercel:

```bash
npm run build
```

Configure Supabase and AI environment variables in Vercel. Apply Supabase migrations before inviting production users.
