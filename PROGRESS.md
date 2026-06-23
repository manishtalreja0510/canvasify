# Canvasify — Progress Tracker

**Last Updated:** 2026-06-23

---

## Current Status: 🟢 MVP Feature-Complete

Auth, payments, dashboard, admin, and create flow are all wired to real Supabase data.

---

## ✅ Completed

### Infrastructure
- [x] Next.js 16.2.9 project setup (App Router, TypeScript, Tailwind v4)
- [x] Supabase project created + schema deployed
- [x] All environment variables configured (Supabase + Razorpay)
- [x] Middleware for route protection (/dashboard, /admin)
- [x] Lenis smooth scroll
- [x] Vercel Analytics + Speed Insights wired up
- [x] Security headers in next.config.ts

### Authentication
- [x] Email + password signup (Supabase Auth)
- [x] Email confirmation flow + `/auth/callback` handler
- [x] Login with session persistence
- [x] Forgot password / reset email → `/auth/update-password`
- [x] Set new password page (PKCE code exchange)
- [x] Protected routes via middleware
- [x] Auto-create user profile on signup (DB trigger)
- [x] Session-aware Navbar (shows user initials + dropdown when logged in)
- [x] Sign out from navbar + dashboard

### Create Flow
- [x] Step 1: Photo upload (drag & drop, validation)
- [x] Step 2: Customize (palette size, canvas size)
- [x] Step 3: Preview (side-by-side, download preview PNG)
- [x] Step 4: Checkout (product selector, coupon code, live total)
- [x] Real `/api/process` call — uploads to Supabase Storage + saves project to DB
- [x] Project ID tracked through checkout and payment flow
- [x] Redirect to login if unauthenticated when processing

### Payments (Razorpay)
- [x] `POST /api/orders` — creates Razorpay order (CANVAS40/WELCOME10 coupons)
- [x] `validateOnly` mode for coupon validation without creating order
- [x] Razorpay checkout widget with dynamic script loading
- [x] HMAC-SHA256 signature verification
- [x] `POST /api/orders/verify` — saves paid order to Supabase with real project_id
- [x] Payment success page with animated confirmation + "What's next" steps
- [x] Error handling (payment failed, network issues)

### Dashboard (Real Data)
- [x] Real user profile (name, email, initials from Supabase)
- [x] Real projects list from DB
- [x] Real orders list from DB
- [x] Real stats (projects count, orders count, total spent, downloads)
- [x] Profile settings save (PATCH /api/profile)
- [x] Admin panel shortcut (shown only for admin role)
- [x] Sign out button wired

### Admin Panel (Real Data)
- [x] Role check — 403 Forbidden for non-admins
- [x] Real metrics via `/api/admin/stats` (service role)
- [x] Real orders table via `/api/admin/orders` with user info
- [x] Real users table via `/api/admin/users`
- [x] Order status update (select dropdown → PATCH /api/admin/orders)
- [x] Refresh data button

### API Routes
- [x] `POST /api/process` — auth check, Supabase Storage upload, DB save
- [x] `POST /api/orders` — Razorpay order creation + coupon logic
- [x] `POST /api/orders/verify` — signature verification + DB save
- [x] `GET /api/orders` — user order history
- [x] `PATCH /api/profile` — update user name/phone
- [x] `POST /api/newsletter` — saves to newsletter_subscribers table
- [x] `POST /api/contact` — saves to support_tickets table
- [x] `GET /api/admin/stats` — revenue + order metrics
- [x] `GET/PATCH /api/admin/orders` — all orders with user info
- [x] `GET /api/admin/users` — all users

### Marketing Pages (UI Complete)
- [x] Homepage — 13 sections
- [x] Gallery, Pricing, About, Blog, Contact, FAQ, Legal pages
- [x] 404 page
- [x] Sitemap.xml + robots.txt

### Documentation
- [x] docs/MASTER_PLAN.md
- [x] docs/PRD.md
- [x] docs/TRD.md
- [x] docs/UI_UX_SPEC.md
- [x] PROGRESS.md
- [x] CHANGELOG.md
- [x] supabase/schema.sql
- [x] .env.supabase.example + .env.razorpay.example

---

## ⬜ Remaining (Post-MVP)

### P1 — Launch Polish
- [ ] Supabase Storage bucket creation (manual: create `canvasify-uploads` in dashboard)
- [ ] Welcome email on signup (Resend — key not added yet)
- [ ] Order confirmation email (Resend — key not added yet)
- [ ] Real AI processing (Replicate/Python — currently returns mock palette)
- [ ] Google OAuth (configure in Supabase dashboard)
- [ ] Gallery — load real user-submitted artwork from DB

### P2 — Growth
- [ ] PostHog analytics events
- [ ] Referral program
- [ ] Subscription billing (Razorpay subscriptions)
- [ ] Corporate bulk order flow

### P3 — Scale
- [ ] Cloudflare R2 migration
- [ ] Sentry error monitoring
- [ ] International shipping

---

## Blockers

| Blocker | Status |
|---|---|
| Supabase Storage bucket `canvasify-uploads` | 🔴 Create manually in Supabase dashboard → Storage |
| AI service (real image processing) | 🟡 Using mock palette — functional for MVP |
| Resend API key | 🟡 Emails not sending yet |
