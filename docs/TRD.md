# Canvasify — Technical Requirements Document (TRD)

**Version:** 1.0  
**Last Updated:** 2026-06-22  
**Status:** In Development

---

## 1. Tech Stack

### Frontend
| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | Next.js | 16.2.9 | App Router, SSR, RSC, edge runtime |
| Language | TypeScript | 5.x | Type safety across full stack |
| Styling | Tailwind CSS | v4 | `@import "tailwindcss"` + `@theme inline` |
| Animation | Framer Motion | 12.x | Page transitions, micro-interactions |
| Smooth Scroll | Lenis | 1.3.x | Buttery scroll experience |
| Forms | React Hook Form + Zod | Latest | Type-safe form validation |
| Notifications | Sonner | 2.x | Toast notifications |
| File Upload | React Dropzone | 15.x | Drag & drop image upload |
| Icons | Lucide React | 1.x | Consistent icon set |
| Components | CVA (class-variance-authority) | Latest | Typed variant components |

### Backend
| Layer | Technology | Reason |
|---|---|---|
| Database | Supabase (PostgreSQL) | Auth + DB + Storage in one |
| Auth | Supabase Auth + @supabase/ssr | Session management via cookies |
| File Storage | Supabase Storage (→ R2 later) | Uploaded photos + generated PDFs |
| API Routes | Next.js Route Handlers (Edge) | Lightweight, fast, Vercel-optimised |
| Server Actions | Next.js Server Actions | Auth flows, form submissions |
| Payments | Razorpay | India-first payment gateway |
| Email | Resend | Transactional emails |
| AI Processing | FastAPI microservice (TBD) | Python for CV/image processing |

### Infrastructure
| Service | Use |
|---|---|
| Vercel | Hosting, Edge Functions, CI/CD |
| Supabase | Database, Auth, Storage |
| Cloudflare R2 | Long-term file storage (scale) |
| PostHog | Product analytics |
| Google Analytics | Marketing analytics |

---

## 2. Architecture

```
Browser
  │
  ├── Next.js App (Vercel Edge)
  │     ├── App Router (RSC + Client Components)
  │     ├── Middleware (auth session refresh + route protection)
  │     ├── Server Actions (auth, forms)
  │     └── API Route Handlers (payments, AI proxy, webhooks)
  │
  ├── Supabase
  │     ├── PostgreSQL (users, projects, orders, subscriptions)
  │     ├── Auth (email/password, OAuth)
  │     └── Storage (original uploads, processed templates, PDFs)
  │
  ├── AI Service (FastAPI on Railway)
  │     ├── POST /process — image → PBN template
  │     └── Returns: palette data, template image URL, sections count
  │
  ├── Razorpay
  │     ├── Create Order API (server-side)
  │     └── Verify Payment Signature (webhook)
  │
  └── Resend
        └── Transactional email API
```

---

## 3. Database Schema (Key Tables)

See `supabase/schema.sql` for the full schema with RLS policies.

### Key relationships
```
auth.users (Supabase managed)
  └── public.users (id mirrors auth.users.id)
        ├── projects (user_id FK)
        │     └── orders (project_id FK)
        ├── subscriptions (user_id FK, unique)
        └── support_tickets (user_id FK, nullable)
```

### RLS Policy Summary
| Table | anon | authenticated user | service_role |
|---|---|---|---|
| users | ✗ | own row only | all |
| projects | ✗ | own rows only | all |
| orders | ✗ | own rows only | all |
| subscriptions | ✗ | own row only | all |
| gallery | published rows | published rows | all |
| coupons | ✗ | ✗ | all |
| newsletter_subscribers | ✗ | ✗ | all |
| support_tickets | ✗ | own rows | all |

---

## 4. API Routes

### Authentication (Server Actions)
| Action | File | Method |
|---|---|---|
| Sign in | `app/auth/actions.ts` → `signIn` | Server Action |
| Sign up | `app/auth/actions.ts` → `signUp` | Server Action |
| Sign out | `app/auth/actions.ts` → `signOut` | Server Action |
| Reset password | `app/auth/actions.ts` → `resetPassword` | Server Action |

### Route Handlers
| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/process` | POST | Required | Proxy image to AI service |
| `/api/orders` | POST | Required | Create Razorpay order |
| `/api/orders` | GET | Required | List user orders |
| `/api/orders/verify` | POST | Required | Verify Razorpay payment |
| `/api/newsletter` | POST | None | Subscribe to newsletter |
| `/api/webhooks/razorpay` | POST | Signature | Payment webhook |

---

## 5. AI Processing Flow

```
1. User uploads image → browser reads as File
2. POST /api/process (multipart/form-data)
   ├── Validate: type (image/*), size (<25MB)
   └── Forward to AI_SERVICE_URL/process
3. AI Service (Python FastAPI):
   ├── Load image with Pillow/OpenCV
   ├── Resize to working resolution
   ├── K-means clustering → palette (12/24/36 colors)
   ├── Segment image regions → numbered zones
   ├── Generate template image (white BG + numbers)
   ├── Generate PDF (A3/A2 print-ready)
   └── Upload outputs to Supabase Storage
4. Return to Next.js:
   └── { template_url, palette, sections_count, pdf_url }
5. Save project to DB → projects table
6. Show real preview to user
```

---

## 6. Payment Flow (Razorpay)

```
1. User clicks "Proceed to Payment"
2. POST /api/orders → creates Razorpay order
   └── Returns: { razorpay_order_id, amount, currency }
3. Open Razorpay checkout widget (client-side)
4. User pays → Razorpay returns:
   └── { razorpay_payment_id, razorpay_order_id, razorpay_signature }
5. POST /api/orders/verify
   ├── Verify HMAC signature server-side
   ├── Update order status → "paid"
   └── Trigger email: order confirmation
6. If digital: generate signed download URL → email to user
7. If physical: create fulfillment task → update status → shipping email
```

---

## 7. File Storage Structure (Supabase Storage)

```
canvasify-uploads/
  ├── originals/
  │     └── {user_id}/{project_id}/original.{ext}
  ├── templates/
  │     └── {user_id}/{project_id}/template.png
  └── pdfs/
        └── {user_id}/{project_id}/template.pdf
```

All paths are private. Signed URLs generated on-demand (1 hour expiry for downloads).

---

## 8. Environment Variables

| Variable | Used In | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Middleware | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (API routes) | ✅ |
| `RAZORPAY_KEY_ID` | Server (order creation) | ✅ for payments |
| `RAZORPAY_KEY_SECRET` | Server (signature verify) | ✅ for payments |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client (checkout widget) | ✅ for payments |
| `RESEND_API_KEY` | Server (emails) | ✅ for emails |
| `AI_SERVICE_URL` | Server (/api/process) | ✅ for AI |
| `AI_SERVICE_API_KEY` | Server (/api/process) | ✅ for AI |
| `NEXT_PUBLIC_APP_URL` | Server Actions (reset URL) | ✅ |

---

## 9. Security

- **RLS**: All tables have Row Level Security enabled
- **Service Role Key**: Never exposed to client — only in server-side API routes
- **Payment Verification**: Razorpay signature verified server-side before marking paid
- **File Validation**: Type + size checked on server before forwarding to AI
- **Auth Middleware**: All `/dashboard` and `/admin` routes protected
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy set in `next.config.ts`
- **Input Sanitisation**: Zod validation on all API route inputs

---

## 10. Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | >90 |
| First Contentful Paint | <1.5s |
| Time to Interactive | <3.5s |
| Core Web Vitals (LCP) | <2.5s |
| AI Processing Time | <30s |
| PDF Generation Time | <10s |
| Page bundle size | <150KB JS (initial) |

---

## 11. Known Technical Debt

| Item | Impact | Fix Timeline |
|---|---|---|
| AI processing is mocked (returns fake data) | Core MVP broken | Priority 1 |
| No real file upload to Supabase Storage | Projects not saved | Priority 1 |
| Razorpay not wired up | No payments | Priority 1 |
| Dashboard shows hardcoded data | Not useful for real users | Priority 2 |
| Admin panel shows hardcoded data | Can't manage orders | Priority 2 |
| No email templates (Resend) | Poor post-purchase UX | Priority 2 |
| Google OAuth not configured | Friction at signup | Priority 3 |
| No error monitoring (Sentry) | Blind to prod errors | Priority 3 |
