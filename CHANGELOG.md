# Changelog

All notable changes to Canvasify are documented here.  
Format: `[version] — YYYY-MM-DD`

---

## [0.3.0] — 2026-06-22

### Added
- Supabase authentication fully wired up (signup, login, forgot password, reset)
- `lib/supabase/client.ts` — typed browser client using `@supabase/ssr`
- `lib/supabase/server.ts` — typed server client with async cookie handling
- `lib/supabase/types.ts` — complete Database type definitions
- `middleware.ts` — session refresh + route protection for `/dashboard` and `/admin`
- `app/auth/actions.ts` — Server Actions: `signIn`, `signUp`, `signOut`, `resetPassword`
- Error banners on all auth forms (real Supabase error messages)
- `useActionState` replacing fake `setTimeout` handlers on all auth pages
- `.env.supabase.example` and `.env.razorpay.example` reference files
- Documentation: `docs/MASTER_PLAN.md`, `docs/PRD.md`, `docs/TRD.md`, `docs/UI_UX_SPEC.md`
- `PROGRESS.md` and `CHANGELOG.md`

### Fixed
- Download Preview button now generates real PNG via Canvas API instead of being a dead button
- Supabase schema: removed `pg_crypto` extension (not available on Supabase hosted Postgres)

### Changed
- Auth pages rewritten to use native `<form action={serverAction}>` with `useActionState`
- Auth pages no longer use controlled state for email/password (rely on FormData)
- Register page shows success screen after signup instead of fake redirect

---

## [0.2.0] — 2026-06-22

### Added
- Lenis smooth scroll provider (`components/providers/smooth-scroll.tsx`)
- Vercel Analytics (`@vercel/analytics/react`)
- Vercel Speed Insights (`@vercel/speed-insights/next`)
- `lib/supabase/` directory structure

### Fixed
- Dev server 500: removed `experimental.optimizeCss` from `next.config.ts` (requires `critters`)
- Dev server 500: moved Google Fonts from `@import url(...)` in CSS to `<link>` in layout head (Tailwind v4 PostCSS expansion makes CSS imports illegal after `@import "tailwindcss"`)
- TypeScript error in `hero.tsx`: `getRootProps()` spread onto `motion.div` caused drag event type conflict — moved into nested plain `<div>`
- TypeScript error in `ai-technology.tsx`: template literal ternary missing `: undefined` fallback
- `footer.tsx`: replaced removed lucide-react icons (`Instagram` → `Camera`, `Twitter` → `Share2`, `Youtube` → `PlayCircle`)

---

## [0.1.0] — 2026-06-22

### Added
- Initial project scaffold (Next.js 16, TypeScript, Tailwind v4)
- Complete design system (`app/globals.css`) — CSS custom properties, glassmorphism, animations
- Root layout with noise overlay, Navbar, Footer, Toaster
- All 30+ pages and routes:
  - Homepage with 13 sections
  - Gallery, Pricing, About, Blog (list + 6 SSG posts), Contact, FAQ
  - Auth: Login, Register, Forgot Password
  - Create wizard (4 steps), User Dashboard, Admin Panel
  - Legal: Terms, Privacy, Refund Policy
  - 404, sitemap.xml, robots.txt
- Component library: Button (CVA), Badge, Card, Input, SectionHeader
- Shared: ScrollToTop, FloatingCTA, PurchaseNotification
- Hooks: useScrollProgress, useLocalStorage, useMediaQuery, useIntersection
- `lib/constants.ts` — all data (products, testimonials, FAQs, blog posts, metrics)
- `lib/utils.ts` — utility functions
- `lib/supabase.ts` — initial Supabase client
- `types/index.ts` — full TypeScript interfaces
- `supabase/schema.sql` — complete DB schema with RLS, triggers, functions
- API routes: `/api/process`, `/api/orders`, `/api/newsletter`
- `.env.example` — all environment variable documentation
