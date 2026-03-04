# Project: my-v0-project

A Next.js 14 portfolio website with Supabase backend integration, migrated from Vercel to Replit.

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (with mock data fallback when env vars missing)
- **Package Manager**: pnpm
- **Port**: 5000 (Replit webview)

## Key Sections

- `/app` — Next.js App Router pages (blog, projects, snippets, admin, shopify-expert)
- `/components` — React components (UI, header, footer, hero, etc.)
- `/lib/supabase.ts` — Supabase client with retry logic and mock data fallback
- `/styles` — Global CSS
- `/public` — Static assets

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (optional, falls back to mock data)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (optional, falls back to mock data)

## Running

```bash
pnpm run dev   # Development server on port 5000
pnpm run build # Production build
pnpm run start # Production server on port 5000
```

## Replit-specific Configuration

- Dev server runs on `0.0.0.0:5000` for Replit compatibility
- `output: 'standalone'` removed from next.config.mjs (not needed in dev)
- Vercel-specific packages kept in package.json but have no effect in Replit environment
