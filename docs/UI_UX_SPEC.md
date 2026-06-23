# Canvasify — UI/UX Specification

**Version:** 1.0  
**Last Updated:** 2026-06-22

---

## 1. Design Philosophy

- **Luxury Dark** — feels like Midjourney meets Stripe, not a craft store
- **Motion-first** — every interaction has a purposeful animation
- **Clarity over cleverness** — copy is direct, CTAs are unambiguous
- **Mobile parity** — no degraded mobile experience, same quality throughout
- **WCAG AA** — minimum accessibility standard for all interactive elements

---

## 2. Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#060816` | Page background |
| `--surface` | `#0D1323` | Cards, panels, modals |
| `--primary` | `#7C5CFF` | Primary buttons, links, active states |
| `--primary-light` | `#9B7FFF` | Hover states for primary |
| `--secondary` | `#B48EFF` | Gradient text endpoints, badges |
| `--accent` | `#00E5FF` | Highlights, aurora effects |
| `--success` | `#00D084` | Success states, checkmarks |
| `--warning` | `#F59E0B` | Warnings, medium password strength |
| `--error` | `#EF4444` | Errors, weak password |
| `--foreground` | `#FFFFFF` | Primary text |
| `--muted` | `#94A3B8` | Secondary text, placeholders |
| `--border` | `rgba(255,255,255,0.08)` | All borders |

### Typography

| Style | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Hero H1 | Inter | 64–96px | 700 | 1.05 |
| Section H2 | Inter | 40–56px | 700 | 1.1 |
| Card H3 | Inter | 20–24px | 700 | 1.3 |
| Body Large | Inter | 18–20px | 400 | 1.6 |
| Body | Inter | 14–16px | 400 | 1.5 |
| Caption | Inter | 11–12px | 400–600 | 1.4 |
| Badge | Inter | 10–11px | 600 | 1 |

Loaded via Google Fonts `<link>` tag in `app/layout.tsx` (not CSS import — Tailwind v4 constraint).

### Spacing
- Base unit: 4px
- Component padding: 16–32px
- Section vertical padding: 80–96px (`py-20` to `py-24`)
- Max content width: 1280px (`max-w-7xl`)
- Content padding: 16px mobile → 24px tablet → 32px desktop

---

## 3. Component Library

### Button (`components/ui/button.tsx`)
Built with CVA. All variants use `motion.button` with `whileTap={{ scale: 0.97 }}`.

| Variant | Background | Use Case |
|---|---|---|
| `gradient` | `#7C5CFF → #B48EFF` | Primary CTA |
| `primary` | `#7C5CFF` solid | Secondary CTA |
| `secondary` | Surface + border | Alternative action |
| `glass` | Glassmorphism | Overlay contexts |
| `ghost` | Transparent | Navigation, back buttons |
| `destructive` | Red | Delete, cancel |

Sizes: `xs` / `sm` / `md` / `lg` / `xl` / `icon`

Props: `loading` (shows spinner), `icon` (left icon), `iconRight` (right icon), `magnetic` (hover magnet effect)

### Input (`components/ui/input.tsx`)
- Extends `React.InputHTMLAttributes` — all native props pass through including `name` for FormData
- Left icon slot, right icon slot
- Error state with red border + error message below
- Focus: purple border + subtle purple background + glow

### Badge (`components/ui/badge.tsx`)
Variants: `default` (purple), `success` (green), `muted` (gray), `new` (purple gradient), `glass` (glassmorphism)

### Card (`components/ui/card.tsx`)
Standard dark card with border. Used throughout dashboard and pricing.

### SectionHeader (`components/ui/section-header.tsx`)
Reusable section heading pattern: badge → title → highlight → description.

---

## 4. Glassmorphism System

```css
.glass {
  background: rgba(13, 19, 35, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

Used on: Navbar (scroll), floating cards in Hero, lightbox overlays.

---

## 5. Animation System

### Framer Motion Patterns

**Page entrance (stagger)**
```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, delay: i * 0.1 }}
```

**Hero elements (cascade)**
```tsx
transition={{ duration: 0.6, delay: 0.1 * index }}
```

**Hover lift**
```tsx
whileHover={{ y: -4, transition: { duration: 0.2 } }}
```

**Modal entrance**
```tsx
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.9 }}
transition={{ duration: 0.3 }}
```

### CSS Animations
| Class | Effect | Duration |
|---|---|---|
| `.float-slow` | Y-axis float | 6s infinite |
| `.float-medium` | Y-axis float | 4s infinite |
| `.pulse-glow` | Box shadow pulse | 2s infinite |
| `.shimmer` | Gradient shimmer | 2.5s infinite |
| `.skeleton` | Loading skeleton | 1.5s infinite |
| `.spin-slow` | 360° rotation | 20s infinite |

### Lenis Smooth Scroll
- Duration: 1.2s
- Easing: `1 - 2^(-10t)` (exponential ease-out)
- Orientation: vertical
- smoothWheel: true

---

## 6. Page Layouts

### Homepage (`/`)
```
<Navbar />          fixed, glassmorphism on scroll
<Hero />            min-h-screen, split layout (copy left, demo right)
<TrustBar />        scrolling logo marquee
<StatsSection />    4 animated counters
<ProblemSolution /> 2-column problem vs solution
<HowItWorks />      4-step horizontal flow
<AITechnology />    interactive step selector + visual
<GalleryPreview />  filterable masonry grid with lightbox
<PricingSection />  toggle one-time/subscription + 3 cards
<Testimonials />    4-card grid + featured carousel
<CorporateSection />B2B + schools
<LeadCapture />     email + photo upload lead gen
<FAQSection />      accordion
<CTASection />      full-width CTA with rotating rings
<Footer />
```

### Auth Pages (`/auth/*`)
- Centered card, max-w-md
- Background: dot pattern + blurred orbs
- Logo at top of card
- Error banner above form
- Social login above divider, email form below

### Create Wizard (`/create`)
- 4-step progress indicator at top
- Step 1: Upload (large dropzone)
- Step 2: Customize (preview sidebar + options panel)
- Step 3: Preview (side-by-side comparison)
- Step 4: Checkout (product selector + order summary)

### Dashboard (`/dashboard`)
- Fixed left sidebar (240px) + scrollable main content
- Sidebar: user avatar + name + nav items
- Tabs: Overview / Projects / Orders / Downloads / Subscription / Settings

### Admin (`/admin`)
- Fixed left sidebar (200px, smaller than dashboard)
- Metric cards row
- Orders table with search + status filter
- Recent users list

---

## 7. Responsive Breakpoints

| Name | Width | Tailwind |
|---|---|---|
| Mobile | <640px | (default) |
| Tablet | 640–1024px | `sm:` / `md:` |
| Desktop | 1024–1280px | `lg:` |
| Wide | >1280px | `xl:` |

Key responsive behaviours:
- Navbar: hamburger menu on mobile (`<lg`)
- Hero: single column on mobile, 2-col on desktop
- Gallery: 2 cols mobile → 3 cols tablet → 4 cols desktop
- Dashboard sidebar: hidden on mobile (drawer), visible on `lg+`
- Pricing: stacked on mobile, 3-col on desktop

---

## 8. Noise Overlay
Fixed position, `z-index: 9999`, `pointer-events: none`, `opacity: 0.025`.
SVG fractal noise pattern tiled at 200×200px. Adds film-grain texture to the entire UI without affecting interaction.

---

## 9. Key UX Decisions

| Decision | Rationale |
|---|---|
| Free preview before payment | Removes purchase anxiety — see the output first |
| No account required for preview | Reduces friction at top of funnel |
| Dropzone in Hero | Immediate engagement, zero-click to start |
| `CANVAS40` coupon in announcement bar | Urgency + immediate perceived value |
| Purchase notifications (social proof) | "Priya S. just ordered" — FOMO conversion trigger |
| Floating CTA after 8s / 40% scroll | Catches engaged-but-not-converted users |
| Password strength meter | Reduces support tickets for weak password lockouts |
| Success screen after register (not auto-redirect) | Sets expectation: email confirmation required |
